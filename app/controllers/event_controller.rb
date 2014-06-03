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
		@event = Event.new
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
			redirect_to mine_event_index_url, :notice => 'Event deleted'
		else
			redirect_to mine_event_index_url, :alert => 'Error deleting event'
		end
	end

	private
	def event_params
		params.require(:event).permit(:id, :title, :community, :address, :user_id, :date, :start_time, :end_time, :lat, :long, :event_type, :all_age, :alcohol)
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
		  config.access_token        = "2495626352-9rSuIrseKlEeFtK4ayFSq2KjT6RUorHmVxWi8If"
		  config.access_token_secret = "WIvdyxUTU56iKzFDlcZNIMwTmlU19ntGbTXkiIXZaXyr0"
		end
		event_type = new_event.event_type == "Other" ? "" : new_event.event_type
		client.update("Like #{event_type} parties? @#{new_event.user.name} is having one. Check it out: http://YYCYouThere.com/event/#{new_event.id} #NeighbourDayYYC")
	end
end
