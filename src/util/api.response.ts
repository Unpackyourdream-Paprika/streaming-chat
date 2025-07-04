import { ApiResponseOk } from '@/common/dto/api-response.dto';

export class CommonResponse {
  public static ok(message: string, data: any): ApiResponseOk {
    return {
      success: true,
      message,
      data,
    };
  }
}
