module ViewHelper
  # Generate title for current page
  def title(page_title)
    content_for :title, page_title.to_s
  end

  # Generate id for current page
  def page_id(page_id)
  	content_for :page_id, page_id.to_s
  end

  # Generate an array for times, in 30min interval
  def time_options()
  	start_time = Time.local(2014, 6, 1, 8, 0).to_i
  	end_time = Time.local(2014, 6, 2, 2, 0).to_i
  	time_array = Array.new

  	while start_time <= end_time do
  		time_array.push(Time.at(start_time).strftime("%I:%M%p"))
  		start_time = start_time + (30 * 60)
  	end

  	time_array
  end

  # Generate an array for different party types
  def party_type_options()
    ["BBQ", "Picnic", "Potluck", "Catered"]
  end

  # A function to read a SVG file and output its data
  def inline_svg(path)
    File.open("app/assets/images/#{path}", "rb") do |file|
      raw file.read
    end
  end

  # Return current year
  def current_year()
    Time.now.strftime("%Y")
  end
end