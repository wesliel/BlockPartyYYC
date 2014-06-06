module EventHelper
	def event_twitter_name
		@event.event_type == "Other" ? "" : " ##{@event.event_type}"
	end

	def event_counter(is_plural)
		return_string = ""

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
		(["2014-06-20", "2014-06-21", "2014-06-22"].include? @event.date) == true ? " #NeighbourDay #YYC" : " #YYC"
	end
end
