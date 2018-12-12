#! /usr/bin/env python

import requests
import sys
from urllib.parse import urlsplit, parse_qs


def print_usage():
    print_setup_as_usage()
    print_add_client_usage()


def print_setup_as_usage():
    print("""
    Setup Authorization Server and Infrastructure Console
    ./blockwiz.py setup-as \\
        https://accounts.example.com \\
        "Mr Administrator" \\
        admin@example.com \\
        secretPassword \\
        +919876543210 \\
        https://admin.example.com
    """)


def print_add_client_usage():
    print("""
    Add OAuth Client and Setup Server (Authorization server must be setup)
    ./blockwiz.py add-client \\
        admin@example.com \\
        secretPassword \\
        https://admin.example.com \\
        "Identity Provider" \\
        https://myaccount.example.com \\
    """)


def setup_as():
    try:
        auth_server = sys.argv[2]
        full_name = sys.argv[3]
        email = sys.argv[4]
        password = sys.argv[5]
        mobile = sys.argv[6]
        infrastructure_console = sys.argv[7]
        response = requests.post(
            auth_server + '/setup',
            data={
                'fullName': full_name,
                'email': email,
                'issuerUrl': auth_server,
                'adminPassword': password,
                'phone': mobile,
                'infrastructureConsoleUrl': infrastructure_console,
            }
        )
        setup_infrastructure_console(
            infrastructure_console,
            auth_server,
            response.json())
    except requests.exceptions.ConnectionError as identifier:
        request_error = identifier.__dict__['request']
        print('Connection Error:\n', request_error.__dict__)
    except BaseException:
        print_setup_as_usage()


def add_client():
    try:
        email = sys.argv[2]
        password = sys.argv[3]
        infrastructure_console_url = sys.argv[4]
        client_name = sys.argv[5]
        client_url = sys.argv[6]

        info = requests.get(infrastructure_console_url + '/info').json()
        token = get_token(email, password, info)
        added_client = requests.post(
            info.get('authServerURL') + '/client/v1/create',
            data={
                'name': client_name,
                'redirectUris': [
                    client_url + '/index.html',
                    client_url + '/silent-refresh.html',
                ],
                'allowedScopes': ['openid', 'email', 'roles'],
                'isTrusted': 1,
            },
            headers={
                'Authorization': 'Bearer ' + token,
            }
        ).json()
        setup_response = requests.post(
            client_url + '/setup',
            data={
                'appURL': client_url,
                'authServerURL': info.get('authServerURL'),
                'clientId': added_client.get('clientId'),
                'clientSecret': added_client.get('clientSecret'),
            }
        )
        print(added_client, setup_response)
    except requests.exceptions.ConnectionError as identifier:
        request_error = identifier.__dict__['request']
        print('Connection Error:\n', request_error.__dict__)
    except BaseException:
        print_add_client_usage()


def get_token(user, pw, info):
    s = requests.Session()
    s.post(
        info.get('authServerURL') + '/auth/login',
        data={
            'username': user,
            'password': pw,
        }
    )
    token_request_url = "{url}?scope={scope}&response_type=token&client_id={client_id}&redirect_uri={redirect_uri}".format(
        url=info.get('authorizationURL'),
        scope='openid%20email',
        client_id=info.get('clientId'),
        redirect_uri=info.get('callbackURLs')[0],
    )
    token_response = s.get(token_request_url).__dict__.get('url')
    split_result = urlsplit(token_response.replace('index.html#', '?'))
    return parse_qs(split_result.query).get('access_token')[0]


def setup_infrastructure_console(
        infrastructure_console,
        auth_server,
        setup_response):
    """
    setup_response = {
        'redirectUris': [
            'http://admin.localhost:5000/index.html',
            'http://admin.localhost:5000/silent-refresh.html'
        ],
        'allowedScopes': ['openid', 'roles', 'email'],
        'uuid': 'fc8b7d2d-ba03-4418-8997-73bf3356860f',
        'clientId': '06f069d0-5e38-4d52-8c72-4927310f7b05',
        'clientSecret': 'fcd9a97a6c3a5c25c0b5e02e46a365a4fe16c31c5847bb6b9da306a462f8f96a',
        'name': 'Infrastructure Console',
        'isTrusted': 1
    }
    """
    response = requests.post(
        infrastructure_console + '/setup',
        data={
            'appURL': infrastructure_console,
            'authServerURL': auth_server,
            'clientId': setup_response.get('clientId'),
            'clientSecret': setup_response.get('clientSecret')
        }
    )
    print(setup_response, response)


if __name__ == '__main__':
    command = None

    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

    if command == 'setup-as':
        setup_as()
    elif command == 'add-client':
        add_client()
    else:
        print_usage()
