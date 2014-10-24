class CreateRegisterRecords < ActiveRecord::Migration
  def change
    create_table :register_records do |t|
      t.integer :user_id
      t.integer :status

      t.timestamps
    end
  end
end
