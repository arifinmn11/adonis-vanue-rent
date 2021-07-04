import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Field from './Field'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ columnName: 'play_date_start' })
  public playDateStart: DateTime

  @column.dateTime({ columnName: 'play_date_end' })
  public playDateEnd: DateTime

  @column({ columnName: 'field_id' })
  public fieldId: number

  @column({ columnName: 'user_id' })
  public userId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'booking_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'user_has_bookings'
  })
  public players: ManyToMany<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'userId'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Field, {
    foreignKey: 'fieldId'
  })
  public field: BelongsTo<typeof Field>


  public serializeExtras() {
    return {
      players_count: this.$extras.playersCount
    }
  }

}
