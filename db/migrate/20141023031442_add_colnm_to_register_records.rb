class AddColnmToRegisterRecords < ActiveRecord::Migration
  def change
    add_column :register_records, :register_time, :datetime
  end
end
