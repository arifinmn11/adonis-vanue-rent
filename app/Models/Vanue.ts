import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Field from './Field'

export default class Vanue extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public phone: string

  @column({ columnName: 'user_id' })
  public userId: number

  @column()
  public user: User

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => Field, {
    foreignKey: 'vanue_id',
    localKey: 'id'
  })
  public fields: HasMany<typeof Field>
}
