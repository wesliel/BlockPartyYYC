class AddTypeToEvents < ActiveRecord::Migration
  def change
  	add_column :events, :type, :string
  	add_column :events, :deleted, :integer, :default => 0
  end
end
