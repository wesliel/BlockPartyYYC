class AddTweetToEvents < ActiveRecord::Migration
  def change
    add_column :events, :tweet, :text
  end
end
