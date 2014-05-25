# Controller class for CRUD actions of event objects
class EventController < ApplicationController
	# p@rtyp!nYYC2014

	# Displays all the events
	def index
		@events = Event.all
	end

	def show
		@event = Event.find(params[:id])
	end

	def new
	end

	def create
		@event = Event.new(event_params)
		@event.save
		redirect_to @event
	end

	def edit
		@event = Event.find(params[:id])
	end

	def update
	end

	def destroy
	end

	private
		def event_params
			params.require(:event).permit(:title, :community, :address, :organizer, :date, :start_time, :end_time)
		end
end
