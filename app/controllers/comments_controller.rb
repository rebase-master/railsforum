class CommentsController < ApplicationController
  def new
    @topic = Topic.find(params[:topic_id])
    @comment = Comment.new
    @title = "New Comment"
  end

  def create
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.build(comment_params)
      if @comment.save
        flash[:notice] = "Comment added successfully!"
        redirect_to(topic_path(@topic.id))
      else
        flash[:notice] = "Error creating comment!"
        render 'new'
      end
  end

  def edit
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments(params[:id])
    @title = "Edit Comment"
  end
  def update
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.find(params[:id])
    if @comment.update_attributes(comment_params)
      flash[:notice] = "Comment updated successfully!"
      redirect_to(topic_path(@topic.id))
    else
      flash[:notice] = "Error updating comment!"
      render 'edit'
    end
  end

  def delete
    @topic = Topic.find(params[:topic_id])
    @comment = @topic.comments.find(params[:id])
    @title = "Delete Comment"
  end

  def destroy
    topic = Topic.find(params[:topic_id])
    comment = topic.comments(params[:id])
    comment.destroy
    flash[:notice] = "Comment deleted successfully!"
    redirect_to(topic_path(params[:id]))
  end
  private
  def comment_params
    params.require(:comment).permit(:name, :content)
  end
end
