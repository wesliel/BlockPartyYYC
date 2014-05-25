module ViewHelper
  def title(page_title)
    content_for :title, page_title.to_s
  end

  def page_id(page_id)
  	content_for :page_id, page_id.to_s
  end
end