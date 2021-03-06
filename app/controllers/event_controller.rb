# Controller class for CRUD actions of event objects
class EventController < ApplicationController
	# p@rtyp!nYYC2014

	before_action :require_login, only: [:mine, :new, :create, :edit, :update, :destory]

	# Displays all the events
	def index
		today = Time.now.strftime("%Y-%m-%d")
		@events_json = Event.where("lat IS NOT NULL AND long IS NOT NULL AND deleted = 0 AND date >= '#{today}'").to_json(:include => :user)
	end

	def mine
		if session[:user_id].to_s == "1"
			@events = Event.where(:deleted => 0.to_s)
		else
			@events = Event.where(:user_id => session[:user_id].to_s, :deleted => 0.to_s)
		end
	end

	def show
		@event = Event.find_by(id: params[:id], deleted: 0.to_s)
		@event_json = @event.to_json(:include => :user)
	end

	def new
		@event = Event.new
	end

	def create
		@event = Event.new(event_params)
		if !has_access
			redirect_to new_event_url, :alert => "You cannot create an event as a different user."
		else
			if @event.tweet == ""
				@event.tweet = "Like#{event_twitter_name} #{event_counter(true)}? @#{@event.user.name} is having one!"
			end
			@event.save
			tweet("#{@event.tweet} YYCYouThere.com/event/#{@event.id}#{hash_tag}")
			redirect_to @event
		end
	end

	def edit
		@event = Event.find(params[:id])
		if !has_access
			redirect_to @event, :alert => "You cannot edit an event you did not submit."
		end
	end

	def update
		@event = Event.find(params[:id])

		if !has_access
			redirect_to @event, :alert => "You cannot edit an event you did not submit."
		else
			# Set a default tweet
			if event_params['tweet'] == ""
				params.require(:event)['tweet'] = "Going to @#{@event.user.name}'s #{event_twitter_name} #{event_counter(false)}? It has been updated."
			end
			if @event.update(event_params)
				tweet("#{@event.tweet} YYCYouThere.com/event/#{@event.id}#{hash_tag}")
				redirect_to @event
			else
				render 'edit'
			end
		end
	end

	def destroy
		@event = Event.find(params[:id])

		if !has_access
			redirect_to @event, :alert => "You cannot delete an event you did not submit."
		else
			if @event.update(:deleted => 1)
				tweet("Going to @#{@event.user.name}'s #{event_twitter_name} #{event_counter(false)}? Looks like it has been cancelled. Find another one at: YYCYouThere.com/#{hash_tag}")
				redirect_to mine_event_index_url, :notice => "Event deleted"
			else
				redirect_to mine_event_index_url, :alert => "There was an problem deleting your event."
			end
		end
	end

	private
	def event_params
		params.require(:event).permit(:id, :title, :community, :address, :user_id, :date, :start_time, :end_time, :lat, :long, :event_type, :all_age, :alcohol, :description, :tweet)
	end

	def require_login
		if session[:user_id] == nil
			redirect_to root_url, :alert => "You must be logged in first"
		end
	end

	# Tweet to YYCYouThere when someone creates a new party
	def tweet(my_tweet)
		client = Twitter::REST::Client.new do |config|
		  config.consumer_key        = "KldkSggbsWhBkaP9rnDXHSDfd"
		  config.consumer_secret     = "NYnAW2YJsuj04zgXzcef2sZQ1yIMcxCdjOjaF0JymF9ValOuAp"
		  config.access_token        = "2495626352-9rSuIrseKlEeFtK4ayFSq2KjT6RUorHmVxWi8If"
		  config.access_token_secret = "WIvdyxUTU56iKzFDlcZNIMwTmlU19ntGbTXkiIXZaXyr0"
		end

		client.update(my_tweet)
	end

	def event_twitter_name
		@event.event_type == "Other" ? "" : " ##{@event.event_type}"
	end

	def event_counter(is_plural)
		case @event.event_type
			when "BBQ"
				return is_plural ? "#parties" : "#party"
			when "Potluck"
				return is_plural ? "#parties" : "#party"
			when "Catered"
				return is_plural ? "#parties" : "#party"
			when "Picnic"
				return is_plural ? "#parties" : "#party"
			when "Community"
				return is_plural ? "#events" : "#event"
			when "Fundraiser"
				return is_plural ? "#events" : "#event"
			when "Other"
				return is_plural ? "#events" : "#event"
		end
	end

	def hash_tag
		(["2015-06-20", "2015-06-21", "2015-06-22"].include? @event.date) == true ? " #YYCNeighbourDay #YYC" : " #YYC"
	end

	def has_access
		if (session[:user_id] == @event.user.id) or (session[:user_id].to_s == "1")
			return true
		else
			return false
		end
	end
end
