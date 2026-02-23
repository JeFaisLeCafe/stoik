import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Response } from "express";
import { ShortenDto } from "./dto/shorten.dto";
import { UrlService } from "./url.service";

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post("api/shorten")
  @HttpCode(HttpStatus.CREATED)
  shorten(
    @Body() dto: ShortenDto,
    @Headers("x-easter-egg") easterEggHeader?: string,
  ) {
    const easterEgg = easterEggHeader?.toLowerCase() === "true";
    const url = dto?.url;
    if (!url || typeof url !== "string") {
      throw new BadRequestException("Missing or invalid url");
    }

    const trimmed = url.trim();
    if (!this.urlService.isValidUrl(trimmed)) {
      throw new BadRequestException("Invalid URL. Use http or https.");
    }

    try {
      return this.urlService.shorten(trimmed, easterEgg);
    } catch {
      throw new ServiceUnavailableException(
        "Could not generate unique short code"
      );
    }
  }

  @Get(":shortCode")
  redirect(@Param("shortCode") shortCode: string, @Res() res: Response) {
    const originalUrl = this.urlService.findByShortCode(shortCode);

    if (!originalUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(302, originalUrl);
  }
}
