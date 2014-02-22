class Topic
  include Mongoid::Document

  field :id,            type: Integer
  field :name,          type: String
  field :title,         type: String
  field :content,       type: String
  has_many :comments
end