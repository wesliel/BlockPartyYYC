# Controller class for CRUD actions of event objects
class EventController < ApplicationController
	# p@rtyp!nYYC2014

	# Displays all the events
	def index
		@events_json = Event.where("lat IS NOT NULL AND long IS NOT NULL").to_json
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
			redirect_to event_index_url, :notice => 'Error deleting event'
		end
	end

	private
		def event_params
			params.require(:event).permit(:title, :community, :address, :organizer, :date, :start_time, :end_time, :lat, :long, :type)
		end
end
