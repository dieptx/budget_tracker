-- This is an empty migration.
UPDATE public."Fund"
SET name = 'Quỹ hàng ngày'::text
WHERE id = 1::integer;

UPDATE public."Fund"
SET name = 'Quỹ kế hoạch'::text,
    type = 'sinking'
WHERE id = 3::integer;

UPDATE public."Fund"
SET name = 'Quỹ đầu tư'::text,
    type = 'investment'
WHERE id = 4::integer;

UPDATE public."Fund"
SET name = 'Quỹ khẩn cấp'::text,
    type = 'emergency'
WHERE id = 2::integer;

