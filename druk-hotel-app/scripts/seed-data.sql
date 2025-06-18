-- Insert sample hotels
INSERT INTO hotels (name, description, image_url, location, rating, price_per_night) VALUES
('Tigers Nest Resort', 'Luxury hotel in the heart of the city with world-class amenities', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/f3/11/d9/caption.jpg?w=900&h=500&s=1', 'Paro, Bhutan', 4.7, 6941),
('Zhiwang Heritage Hotel', 'Beautiful beachfront resort with stunning ocean views and spa services', 'https://www.zhiwalingheritage.com/storage/dining/2/201223020511-MonkBar-1.jpg', 'Paro, Bhutan', 4.5, 3066),
('Mountain Lodge', 'Cozy lodge surrounded by nature, perfect for outdoor enthusiasts', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7MEAJf7CTZ7mznY6-CSo3EZCVgK5H4k0Ew&s', 'Bumthang, Bhutan', 4.6, 4521),
('Ma-Chhim Furnished', 'Modern hotel with convenient location and business facilities', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMA7EgM8FHAzzNSywI3yhp50yNNKWDuig7w&s', 'Phuntsholing, Bhutan', 4.4, 4136),
('Bhutan Resience', 'Elegant villa with private beach access and luxury accommodations', 'https://imgservice.casai.com/500x245/hotel-phuntsho-pelri-bt-thimphu-ep-114088890-0.jpg', 'Phuntsholing, Bhutan', 4.4, 3022);

-- Insert sample rooms for each hotel, using the same image for each room type across all hotels
INSERT INTO rooms (hotel_id, room_type, description, price_per_night, image_url) 
SELECT 
  h.id,
  room_data.room_type,
  room_data.description,
  h.price_per_night + room_data.price_addon,
  CASE
    WHEN room_data.room_type = 'Standard Room' THEN 'https://www.kewhotel.com.ph/tagbilaran/wp-content/uploads/photo-gallery/standard_room/standard_double3.jpg'
    WHEN room_data.room_type = 'Deluxe Suite' THEN 'https://www.peninsula.com/-/media/pbk/rooms/new-suite-images/deluxe_suite.jpg'
    WHEN room_data.room_type = 'Presidential Suite' THEN 'https://www.thepostoakhotel.com/img/resort/875x600/Presidential-living-room_02.jpg'
    ELSE '/placeholder.svg?height=200&width=300'
  END
FROM hotels h
CROSS JOIN (
  VALUES 
    ('Standard Room', 'Comfortable room with city view and modern amenities', 0),
    ('Deluxe Suite', 'Spacious suite with premium amenities and separate living area', 100),
    ('Presidential Suite', 'Luxury suite with panoramic views and exclusive services', 300)
) AS room_data(room_type, description, price_addon);

