import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Type } from 'App/Enums/Type'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()
      table.enu('type', [Type.soccer, Type.minisoccer, Type.futsal, Type.basketball, Type.volleyball]).notNullable()
      table.integer('vanue_id').unsigned().references('id').inTable('vanues').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
