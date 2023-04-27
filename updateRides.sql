UPDATE ride
SET status_id = 2
WHERE departure_date < NOW()::DATE;