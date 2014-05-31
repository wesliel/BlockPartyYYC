class CreateUserEventsRelationship < ActiveRecord::Migration
  def change
  	rename_column :events, :organizer, :user_id
  	add_index :events, :user_id
  end
end
