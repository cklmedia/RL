class AddCloumToUser < ActiveRecord::Migration
  def change
    add_column :users, :tel, :string
  end
end
