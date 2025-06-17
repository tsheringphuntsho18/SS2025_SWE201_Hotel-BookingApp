-- Insert sample hotels
INSERT INTO hotels (name, description, image_url, location, rating, price_per_night) VALUES
('Grand Plaza Hotel', 'Luxury hotel in the heart of the city with world-class amenities', '/placeholder.svg?height=200&width=300', 'New York, NY', 4.8, 299),
('Ocean View Resort', 'Beautiful beachfront resort with stunning ocean views and spa services', '/placeholder.svg?height=200&width=300', 'Miami, FL', 4.6, 199),
('Mountain Lodge', 'Cozy lodge surrounded by nature, perfect for outdoor enthusiasts', '/placeholder.svg?height=200&width=300', 'Aspen, CO', 4.7, 249),
('City Center Inn', 'Modern hotel with convenient location and business facilities', '/placeholder.svg?height=200&width=300', 'Chicago, IL', 4.4, 179),
('Seaside Villa', 'Elegant villa with private beach access and luxury accommodations', '/placeholder.svg?height=200&width=300', 'San Diego, CA', 4.9, 399);

-- Insert sample rooms for each hotel
INSERT INTO rooms (hotel_id, room_type, description, price_per_night, image_url) 
SELECT 
  h.id,
  room_data.room_type,
  room_data.description,
  h.price_per_night + room_data.price_addon,
  '/placeholder.svg?height=200&width=300'
FROM hotels h
CROSS JOIN (
  VALUES 
    ('Standard Room', 'Comfortable room with city view and modern amenities', 0),
    ('Deluxe Suite', 'Spacious suite with premium amenities and separate living area', 100),
    ('Presidential Suite', 'Luxury suite with panoramic views and exclusive services', 300)
) AS room_data(room_type, description, price_addon);
