class ChangeDatetimeTypes < ActiveRecord::Migration
  def change
		change_column :events, :date,  :string
		change_column :events, :start_time,  :string
		change_column :events, :end_time,  :string
  end
end
