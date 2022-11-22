import * as original from "supertest";
export = supertest;

declare namespace supertest {
  interface Response extends original.Response {}

  interface Request extends original.Request {}

  interface DocumentOpts extends Record<string, unknown> {
    host: string;
    protocol: string;
    maxHeaderLength?: number;
    outputDir?: string;
  }

  type HeaderValue = string | { value: string; description: string };

  interface DocumentRequest {
    /** URL */
    url: string;
    /** headers as object */
    headers: Record<string, HeaderValue>;
    /** HTTP method */
    method: string;
    /** header in raw HTTP header format.
     * Will be generated from other input if empty. */
    _header?: string;
    /** Either text or data must be set */
    text?: string;
    /** Either text or data must be set */
    data?: any;
  }

  interface DocumentResponse {
    /** headers as object */
    headers: Record<string, unknown>;
    /** The HTTP status code */
    statusCode: number;
    /** Either text or data must be set */
    text?: string;
    /** Either text or data must be set */
    data?: any;
  }

  class Document {
    constructor(
      name: string,
      req: DocumentRequest,
      res: DocumentResponse,
      opts: DocumentOpts
    );
    static fromTest(
      name: string,
      test: Test,
      res: Response,
      opts: DocumentOpts
    ): Document;
    write(): void;
  }

  interface Test extends original.Test {
    document(name: string, opts?: DocumentOpts): this;
    setD(field: string, val: string, desc?: string): this;
  }
}
