# Controller class for CRUD actions of event objects
class EventController < ApplicationController
	# p@rtyp!nYYC2014

	before_action :require_login, only: [:mine, :new, :create, :edit, :update, :destory]

	# Displays all the events
	def index
		@events_json = Event.where("lat IS NOT NULL AND long IS NOT NULL AND deleted = 0").to_json(:include => :user)
	end

	def mine
		@events = Event.where(:user_id => session[:user_id].to_s, :deleted => 0.to_s)
	end

	def show
		@event = Event.find_by(id: params[:id], deleted: 0.to_s)
		@event_json = @event.to_json(:include => :user)
	end

	def new
	end

	def create
		@event = Event.new(event_params)

		if session[:user_id].to_s == event_params[:user_id].to_s
			@event.save
			tweet(@event)
			redirect_to @event
		else
			redirect_to new_event_url, :alert => "Error creating event" + session[:user_id].to_s + ":" + event_params[:user_id]
		end
	end

	def edit
		@event = Event.find(params[:id])
	end

	def update
		@event = Event.find(params[:id])

		if @event.update(event_params)
			redirect_to @event
		else
			render 'edit'
		end
	end

	def destroy
		@event = Event.find(params[:id])

		if @event.update(:deleted => 1)
			redirect_to event_index_url, :notice => 'Event deleted'
		else
			redirect_to event_index_url, :alert => 'Error deleting event'
		end
	end

	private
	def event_params
		params.require(:event).permit(:title, :community, :address, :user_id, :date, :start_time, :end_time, :lat, :long, :event_type, :all_age, :alcohol)
	end

	def require_login
		if session[:user_id] == nil
			redirect_to root_url, :alert => "You must be logged in first"
		end
	end

	# Tweet to YYCYouThere when someone creates a new party
	def tweet(new_event)
		client = Twitter::REST::Client.new do |config|
		  config.consumer_key        = "KldkSggbsWhBkaP9rnDXHSDfd"
		  config.consumer_secret     = "NYnAW2YJsuj04zgXzcef2sZQ1yIMcxCdjOjaF0JymF9ValOuAp"
		  config.access_token        = "2495626352-ylmiDmS8h3b6p3FjGzIm6GWn9VwVAQEhwlHHnHc"
		  config.access_token_secret = "mGfx7hXHBlxdeQCnaAXO5cU5UQsLXr1Kc0b30a8IiHX5O"
		end
		client.update("Like #{new_event.event_type} parties? @#{new_event.user.name} is having one. Check it out: http://YYCYouThere.com/event/#{new_event.id} #NeighbourDayYYC")
	end
end
