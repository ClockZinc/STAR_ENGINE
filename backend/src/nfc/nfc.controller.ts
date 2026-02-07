import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NfcService } from './nfc.service';

@ApiTags('NFC溯源')
@Controller('nfc')
export class NfcController {
  constructor(private nfcService: NfcService) {}

  @Get('verify/:nfcUuid')
  @ApiOperation({ summary: '验证NFC真伪' })
  async verify(@Param('nfcUuid') nfcUuid: string) {
    return this.nfcService.verifyNfc(nfcUuid);
  }
}
