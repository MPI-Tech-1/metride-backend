# Discounts and MVest Postman guide

Import both JSON files in this directory, select the **Metride Local — Discounts & MVest**
environment, and update `baseUrl` if required.

## Setup order

1. Run the new database migrations. No dummy feature data is created.
2. Use **Authentication → Admin Login**. Its test script stores `adminToken`.
3. Create a promotion from **Discounts — Admin**.
4. Log in as a customer and validate the promotion code. Validation does not require a booking and
   does not reserve or consume the promotion.
5. Create a normal pending booking through the existing booking API, place its identifier in
   `bookingIdentifier`, and apply the promotion before starting checkout.
6. Create an MVest owner from **MVest — Admin** using your own development values.
7. Put an existing `driver_vehicles.identifier` in `driverVehicleIdentifier`, then create the
   agreement.
8. Run **MVest Owner Login** and use the owner dashboard endpoints.

## Behaviour and safety

- All money fields use kobo.
- Existing bookings have `driver_vehicle_id = NULL` and do not generate MVest earnings.
- A promotion can only be applied or removed while payment is pending and checkout has not begun.
- Code-only validation returns the promotion type and value, but final eligibility and the exact
  discount amount are calculated again when the code is applied to a booking.
- The server calculates discounts; clients never submit a discount amount.
- Completed, paid trips generate at most one MVest earning because `mvest_earnings.booking_id` is
  unique.
- Driver earnings remain on the existing commission calculation. MVest commission comes from the
  platform remainder, so agreement creation rejects a combined driver/owner commission above 100%.
- MVest owner APIs are scoped to the authenticated owner.
- `Mark Earning Paid` records a manual payout; this MVP does not initiate a bank transfer.

## Production rollout

Deploy migrations before application code. The migrations are additive: they create new tables,
add nullable columns, and do not backfill or modify existing monetary records. Enrol one internal
test vehicle first, complete a paid test trip, and reconcile the driver and MVest earning records
before activating additional agreements.
