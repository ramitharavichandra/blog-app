const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, description, category } = req.body;
    const blog = await Blog.create({ title, content, description, category, author: req.userId });
    await blog.populate('author', 'name email avatar');
    res.status(201).json({ success: true, message: 'Blog created', blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create blog', error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { status: 'published' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Blog.countDocuments(query),
    ]);

    res.json({
      success: true,
      blogs,
      pagination: { total, pages: Math.ceil(total / limit), currentPage: parseInt(page) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email avatar bio')
      .populate('comments.user', 'name avatar');

    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.views += 1;
    await blog.save();

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog', error: error.message });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your blogs', error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, content, description, category, status } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (description !== undefined) blog.description = description;
    if (category) blog.category = category;
    if (status) blog.status = status;

    await blog.save();
    await blog.populate('author', 'name email avatar');

    res.json({ success: true, message: 'Blog updated', blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update blog', error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog', error: error.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const alreadyLiked = blog.likes.some((id) => id.toString() === req.userId.toString());
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== req.userId.toString());
    } else {
      blog.likes.push(req.userId);
    }

    await blog.save();
    res.json({ success: true, message: alreadyLiked ? 'Like removed' : 'Liked', likes: blog.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to like blog', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.comments.push({ user: req.userId, text });
    await blog.save();
    await blog.populate('comments.user', 'name avatar');

    res.status(201).json({ success: true, message: 'Comment added', comments: blog.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
  }
};
