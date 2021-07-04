import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserHasBookings extends BaseSchema {
  protected tableName = 'user_has_bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('booking_id').unsigned().references('id').inTable('bookings').onDelete('CASCADE')
      table.unique(['booking_id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
