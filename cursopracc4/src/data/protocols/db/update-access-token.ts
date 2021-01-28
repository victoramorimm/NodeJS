export interface UpdateAccessTokenModel {
  id: string
  token: string
}

export interface UpdateAccessTokenRepository {
  updateAccessToken(data: UpdateAccessTokenModel): Promise<void>
}
