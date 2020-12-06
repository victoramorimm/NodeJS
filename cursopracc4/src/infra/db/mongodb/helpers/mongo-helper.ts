import { MongoClient } from 'mongodb'

export const MongoHelper = {
  uri: null as string,
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }
}
