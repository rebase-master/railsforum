class TopicsController < ApplicationController
  def index
    @topics = Topic.order("id ASC")
    respond_to do |format|
      if request.xhr?
        format.json { render json: @topics}
      else
        format.html{}
      end
    end
  end
  def new
    @topic = Topic.new
  end

  #def create
  #  if request.xhr?
  #      @topic = Topic.new(topic_params)
  #      flash[:notice] = "Topic created successfully!"
  #      #format.json { render json: @topic}
  #  end
  #end
  def create
    @topic = Topic.new(topic_params)
    respond_to do |format|
      if @topic.save
        format.html { redirect_to @topic, notice: 'User was successfully created.' }
        format.js   {}
        format.json { render json: @topic, status: :created, location: @topic }
      else
        format.html { render action: "new" }
        format.json { render json: @topic.errors, status: :unprocessable_entity }
      end
    end
  end
  def show
  end

  def edit
  end

  def update
  end

  def delete
  end

  def destroy
  end

  private
    def topic_params
      params.require(:topic).permit(:name, :title, :content)
    end
end
