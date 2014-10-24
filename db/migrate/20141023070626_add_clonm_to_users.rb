class AddClonmToUsers < ActiveRecord::Migration
  def change
    add_column :users, :register_pwd, :string
  end
end
