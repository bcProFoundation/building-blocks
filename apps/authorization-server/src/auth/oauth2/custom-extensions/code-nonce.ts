export function codeNonceExtension() {
  function request(req) {
    const q = req.query;
    const ext: { nonce?: string } = {};

    if (q.nonce) {
      ext.nonce = q.nonce;
    }

    return ext;
  }

  const mod: any = {};
  mod.name = '*';
  mod.request = request;
  return mod;
}
