export abstract class ResponseData<T> {
  declare data: T;
  declare error: { code: number, message: string };
}
