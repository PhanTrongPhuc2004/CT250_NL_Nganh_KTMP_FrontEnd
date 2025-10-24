router.put("/:id", async (req, res) => {
  try {
    const updated = await NguoiDung.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
