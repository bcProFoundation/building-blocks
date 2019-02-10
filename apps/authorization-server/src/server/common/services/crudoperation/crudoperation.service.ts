import { Model } from 'mongoose';

export class CRUDOperationService {
  /**
   *
   * @param model Mongoose Model
   * @param offset pagination offset
   * @param limit page limit
   * @param search search filter
   * @param searchFields: list of fields to search, default ['name'],
   * @param sortQuery mongoose sort query e.g. { name: 'asc' }
   */
  async listPaginate(
    model: Model<any, {}>,
    offset: number,
    limit: number,
    search: string,
    query: any,
    searchFields: string[] = ['name'],
    sortQuery?: any,
  ) {
    if (search) {
      // Search through multiple keys
      // https://stackoverflow.com/a/41390870
      const nameExp = new RegExp(search, 'i');
      query.$or = searchFields.map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = await model
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery)
      .exec();

    return {
      docs: data,
      length: await model.estimatedDocumentCount(),
      offset: Number(offset),
    };
  }
}
