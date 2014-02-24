class TopicsController < ApplicationController
  def index
    @topics = Topic.order("id ASC")
    @title = "Forum"
  end
  def new
    @topic = Topic.new
    @title = "New Topic"
  end

  def create
    @topic = Topic.new(topic_params)
    if @topic.save
      flash[:notice] = "Topic created successfully!"
      redirect_to(topic_path(@topic.id))
    else
      flash[:notice] = "Error creating topic!"
      render 'new'
    end
  end
  def show
    @topic = Topic.find(params[:id])
    @title = @topic.title
  end

  def edit
    @topic = Topic.find(params[:id])
    @title = "Edit Topic"
  end

  def update
    @topic = Topic.find(params[:id])
      if @topic.update_attributes(topic_params)
        flash[:notice] = "Topic updated successfully!"
        redirect_to(topic_path(@topic.id))
      else
        flash[:notice] = "Error updating topic!"
        render 'edit'
      end
  end

  def delete
    @topic = Topic.find(params[:id])
    @title = "Delete Topic"
  end

  def destroy
    topic = Topic.find(params[:id])
    topic.destroy
    flash[:notice] = "Topic '#{topic.title}' deleted successfully!"
    redirect_to(:action => 'index')
  end

  private
    def topic_params
      params.require(:topic).permit(:name, :title, :content)
    end
end