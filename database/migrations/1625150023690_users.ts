import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Role } from '../../app/Enums/Role'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 180).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.enum('role', [Role.user, Role.owner]).defaultTo(Role.user)
      table.boolean('is_verified').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
