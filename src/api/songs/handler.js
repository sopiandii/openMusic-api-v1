/* eslint-disable import/no-extraneous-dependencies */
const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);
    const response = h.response({
      status: "success",
      data: {
        songs,
      },
    });
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: "success",
      data: {
        song,
      },
    });
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: "success",
      message: "Lagu telah diperbarui",
    });
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: "success",
      message: "Lagu telah dihapus",
    });
    return response;
  }
}

module.exports = SongsHandler;
