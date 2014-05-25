class AddFieldsToEvent < ActiveRecord::Migration
  def change
    add_column :events, :title, :string
    add_column :events, :community, :string
    add_column :events, :address, :string
    add_column :events, :organizer, :string
    add_column :events, :date, :datetime
    add_column :events, :start_time, :datetime
    add_column :events, :end_time, :datetime
  end
end
