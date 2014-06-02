class AddAllAgeAndAlcoholFlagsToEvents < ActiveRecord::Migration
  def change
  	add_column :events, :all_age, :integer, :default => 0
  	add_column :events, :alcohol, :integer, :default => 0
  end
end
