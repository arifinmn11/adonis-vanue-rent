import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { Type } from 'App/Enums/Type'
import Vanue from './Vanue'

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: Type

  @column({ columnName: 'vanue_id' })
  public vanueId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @belongsTo(() => Vanue, {
    foreignKey: 'vanueId',
  })
  public vanue: BelongsTo<typeof Vanue>

}
