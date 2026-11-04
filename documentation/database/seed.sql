-- =====================================================================
-- Seed fájl (PostgreSQL) – receptes alkalmazás
-- A jelszavak bcrypt-formátumú DEMÓ értékek, nem valódi hash-ek.
-- Futtatni: npx prisma db execute --file ../documentation/database/sqlDump.sql
-- A tápanyagértékek 100 g (alapanyag), illetve 1 adag (recept) mennyiségre értendők.
-- =====================================================================

BEGIN;

-- Újrafuttathatóság: törlés függőségi sorrendben
TRUNCATE TABLE
    "velemeny_alapanyagrol",
    "velemeny_receptrol",
    "allergen_fiok_osszekoto",
    "huto",
    "recept_alapanyag_osszekoto",
    "allergen_alapanyag_osszekoto",
    "recept",
    "Kategoria",
    "mertekegysegek",
    "allergenek",
    "alapanyag",
    "fiok"
CASCADE;

-- ---------------------------------------------------------------------
-- Profilok
-- ---------------------------------------------------------------------
INSERT INTO "fiok" ("id", "email", "password", "created", "preferencia") VALUES
(1, 'kovacs.anna@example.hu',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '2025-01-12 09:15:00', 'Leves'),
(2, 'nagy.bence@example.hu',   '$2b$10$7EqJtq98hPqEX7fNZaFWoOhi5BEq8mM6rGJX3o1Hk0yTq5dB2cVXe', '2025-02-03 18:42:00', 'Tésztaétel'),
(3, 'szabo.eszter@example.hu', '$2b$10$wJ1d8Yl3kQpXr5uVn0sZ.eC4mTgHfA7bLz2oPq9RiSxKvDuYhNj6G', '2025-03-21 07:30:00', 'Halas étel'),
(4, 'toth.gabor@example.hu',  '$2b$10$Xk3Lm9PqRt5VwYz1AbCdEeFgHiJkLmNoPqRsTuVwXyZ0123456789a', '2025-05-09 20:05:00', 'Reggeli');

-- ---------------------------------------------------------------------
-- Allergének (a 14 EU-s kötelezően jelölendő allergén)
-- ---------------------------------------------------------------------
INSERT INTO "allergenek" ("id", "nev") VALUES
(1,  'Glutén'),
(2,  'Tej (laktóz)'),
(3,  'Tojás'),
(4,  'Mogyoró'),
(5,  'Diófélék'),
(6,  'Szója'),
(7,  'Hal'),
(8,  'Rákfélék'),
(9,  'Zeller'),
(10, 'Mustár'),
(11, 'Szezámmag'),
(12, 'Szulfitok'),
(13, 'Csillagfürt'),
(14, 'Puhatestűek');

-- ---------------------------------------------------------------------
-- Alapanyagok (tápanyag: 100 g-ra)
-- ---------------------------------------------------------------------
INSERT INTO "alapanyag" ("id", "nev", "tapanyag") VALUES
(1,  'Búzaliszt (BL55)',        '{"kcal":364,"feherje_g":10.3,"szenhidrat_g":76.0,"zsir_g":1.0,"rost_g":2.7}'),
(2,  'Tojás',                   '{"kcal":143,"feherje_g":12.6,"szenhidrat_g":0.7,"zsir_g":9.5,"rost_g":0.0}'),
(3,  'Tej (2,8%)',              '{"kcal":52,"feherje_g":3.4,"szenhidrat_g":4.8,"zsir_g":2.8,"rost_g":0.0}'),
(4,  'Vaj',                     '{"kcal":717,"feherje_g":0.9,"szenhidrat_g":0.1,"zsir_g":81.0,"rost_g":0.0}'),
(5,  'Kristálycukor',           '{"kcal":387,"feherje_g":0.0,"szenhidrat_g":100.0,"zsir_g":0.0,"rost_g":0.0}'),
(6,  'Csirkemell',              '{"kcal":120,"feherje_g":22.5,"szenhidrat_g":0.0,"zsir_g":2.6,"rost_g":0.0}'),
(7,  'Burgonya',                '{"kcal":77,"feherje_g":2.0,"szenhidrat_g":17.0,"zsir_g":0.1,"rost_g":2.2}'),
(8,  'Sárgarépa',               '{"kcal":41,"feherje_g":0.9,"szenhidrat_g":9.6,"zsir_g":0.2,"rost_g":2.8}'),
(9,  'Vöröshagyma',             '{"kcal":40,"feherje_g":1.1,"szenhidrat_g":9.3,"zsir_g":0.1,"rost_g":1.7}'),
(10, 'Fokhagyma',               '{"kcal":149,"feherje_g":6.4,"szenhidrat_g":33.0,"zsir_g":0.5,"rost_g":2.1}'),
(11, 'Paradicsom',              '{"kcal":18,"feherje_g":0.9,"szenhidrat_g":3.9,"zsir_g":0.2,"rost_g":1.2}'),
(12, 'Édes paprika (TV)',       '{"kcal":27,"feherje_g":1.0,"szenhidrat_g":6.3,"zsir_g":0.2,"rost_g":2.1}'),
(13, 'Olívaolaj',               '{"kcal":884,"feherje_g":0.0,"szenhidrat_g":0.0,"zsir_g":100.0,"rost_g":0.0}'),
(14, 'Rizs (fehér, nyers)',     '{"kcal":360,"feherje_g":6.7,"szenhidrat_g":79.0,"zsir_g":0.7,"rost_g":1.3}'),
(15, 'Spagetti (száraztészta)', '{"kcal":371,"feherje_g":13.0,"szenhidrat_g":75.0,"zsir_g":1.5,"rost_g":3.2}'),
(16, 'Marhahús (darabolt)',    '{"kcal":158,"feherje_g":21.0,"szenhidrat_g":0.0,"zsir_g":8.0,"rost_g":0.0}'),
(17, 'Tejföl (20%)',           '{"kcal":204,"feherje_g":3.0,"szenhidrat_g":3.5,"zsir_g":20.0,"rost_g":0.0}'),
(18, 'Trappista sajt',          '{"kcal":350,"feherje_g":25.0,"szenhidrat_g":1.5,"zsir_g":27.0,"rost_g":0.0}'),
(19, 'Étcsokoládé (70%)',       '{"kcal":546,"feherje_g":5.0,"szenhidrat_g":61.0,"zsir_g":31.0,"rost_g":7.0}'),
(20, 'Banán',                   '{"kcal":89,"feherje_g":1.1,"szenhidrat_g":23.0,"zsir_g":0.3,"rost_g":2.6}'),
(21, 'Spenót',                  '{"kcal":23,"feherje_g":2.9,"szenhidrat_g":3.6,"zsir_g":0.4,"rost_g":2.2}'),
(22, 'Lencse (száraz)',         '{"kcal":352,"feherje_g":25.0,"szenhidrat_g":60.0,"zsir_g":1.1,"rost_g":31.0}'),
(23, 'Kókusztej',               '{"kcal":197,"feherje_g":2.0,"szenhidrat_g":2.8,"zsir_g":21.0,"rost_g":0.0}'),
(24, 'Tofu',                    '{"kcal":76,"feherje_g":8.0,"szenhidrat_g":1.9,"zsir_g":4.8,"rost_g":0.3}'),
(25, 'Zabpehely',               '{"kcal":372,"feherje_g":13.5,"szenhidrat_g":59.0,"zsir_g":7.0,"rost_g":10.0}'),
(26, 'Fűszerpaprika (őrölt)',   '{"kcal":282,"feherje_g":14.0,"szenhidrat_g":54.0,"zsir_g":13.0,"rost_g":35.0}'),
(27, 'Lazacfilé',               '{"kcal":208,"feherje_g":20.0,"szenhidrat_g":0.0,"zsir_g":13.0,"rost_g":0.0}'),
(28, 'Dió (héjas, magbél)',     '{"kcal":654,"feherje_g":15.0,"szenhidrat_g":14.0,"zsir_g":65.0,"rost_g":6.7}'),
(29, 'Alma',                    '{"kcal":52,"feherje_g":0.3,"szenhidrat_g":14.0,"zsir_g":0.2,"rost_g":2.4}'),
(30, 'Citrom',                  '{"kcal":29,"feherje_g":1.1,"szenhidrat_g":9.3,"zsir_g":0.3,"rost_g":2.8}'),
(31, 'Sertéskaraj', '{"kcal":143,"feherje_g":21,"szenhidrat_g":0,"zsir_g":6,"rost_g":0}'),
(32, 'Darált sertéshús', '{"kcal":263,"feherje_g":17,"szenhidrat_g":0,"zsir_g":21,"rost_g":0}'),
(33, 'Főtt sonka', '{"kcal":107,"feherje_g":18,"szenhidrat_g":1,"zsir_g":3.5,"rost_g":0}'),
(34, 'Füstölt szalonna', '{"kcal":541,"feherje_g":37,"szenhidrat_g":1.4,"zsir_g":42,"rost_g":0}'),
(35, 'Csiperkegomba', '{"kcal":22,"feherje_g":3.1,"szenhidrat_g":3.3,"zsir_g":0.3,"rost_g":1}'),
(36, 'Cukkini', '{"kcal":17,"feherje_g":1.2,"szenhidrat_g":3.1,"zsir_g":0.3,"rost_g":1}'),
(37, 'Padlizsán', '{"kcal":25,"feherje_g":1,"szenhidrat_g":6,"zsir_g":0.2,"rost_g":3}'),
(38, 'Brokkoli', '{"kcal":34,"feherje_g":2.8,"szenhidrat_g":7,"zsir_g":0.4,"rost_g":2.6}'),
(39, 'Karfiol', '{"kcal":25,"feherje_g":1.9,"szenhidrat_g":5,"zsir_g":0.3,"rost_g":2}'),
(40, 'Fehér káposzta', '{"kcal":25,"feherje_g":1.3,"szenhidrat_g":5.8,"zsir_g":0.1,"rost_g":2.5}'),
(41, 'Savanyú káposzta', '{"kcal":19,"feherje_g":0.9,"szenhidrat_g":4.3,"zsir_g":0.1,"rost_g":2.9}'),
(42, 'Sütőtök', '{"kcal":26,"feherje_g":1,"szenhidrat_g":6.5,"zsir_g":0.1,"rost_g":0.5}'),
(43, 'Zöldborsó', '{"kcal":81,"feherje_g":5.4,"szenhidrat_g":14,"zsir_g":0.4,"rost_g":5.7}'),
(44, 'Zöldbab', '{"kcal":31,"feherje_g":1.8,"szenhidrat_g":7,"zsir_g":0.2,"rost_g":2.7}'),
(45, 'Csemegekukorica', '{"kcal":86,"feherje_g":3.2,"szenhidrat_g":19,"zsir_g":1.2,"rost_g":2.7}'),
(46, 'Uborka', '{"kcal":15,"feherje_g":0.7,"szenhidrat_g":3.6,"zsir_g":0.1,"rost_g":0.5}'),
(47, 'Fejes saláta', '{"kcal":15,"feherje_g":1.4,"szenhidrat_g":2.9,"zsir_g":0.2,"rost_g":1.3}'),
(48, 'Rukkola', '{"kcal":25,"feherje_g":2.6,"szenhidrat_g":3.7,"zsir_g":0.7,"rost_g":1.6}'),
(49, 'Paradicsompüré', '{"kcal":82,"feherje_g":4.3,"szenhidrat_g":19,"zsir_g":0.5,"rost_g":4.1}'),
(50, 'Fekete olajbogyó', '{"kcal":115,"feherje_g":0.8,"szenhidrat_g":6,"zsir_g":11,"rost_g":3.2}'),
(51, 'Fetasajt', '{"kcal":264,"feherje_g":14,"szenhidrat_g":4,"zsir_g":21,"rost_g":0}'),
(52, 'Mozzarella', '{"kcal":280,"feherje_g":28,"szenhidrat_g":3,"zsir_g":17,"rost_g":0}'),
(53, 'Parmezán', '{"kcal":431,"feherje_g":38,"szenhidrat_g":4,"zsir_g":29,"rost_g":0}'),
(54, 'Habtejszín (30%)', '{"kcal":292,"feherje_g":2.4,"szenhidrat_g":3.1,"zsir_g":30,"rost_g":0}'),
(55, 'Túró (félzsíros)', '{"kcal":98,"feherje_g":12,"szenhidrat_g":3.5,"zsir_g":4,"rost_g":0}'),
(56, 'Natúr joghurt', '{"kcal":61,"feherje_g":3.5,"szenhidrat_g":4.7,"zsir_g":3.3,"rost_g":0}'),
(57, 'Napraforgóolaj', '{"kcal":884,"feherje_g":0,"szenhidrat_g":0,"zsir_g":100,"rost_g":0}'),
(58, 'Méz', '{"kcal":304,"feherje_g":0.3,"szenhidrat_g":82,"zsir_g":0,"rost_g":0.2}'),
(59, 'Kakaópor', '{"kcal":228,"feherje_g":19.6,"szenhidrat_g":57.9,"zsir_g":13.7,"rost_g":33}'),
(60, 'Fahéj (őrölt)', '{"kcal":247,"feherje_g":4,"szenhidrat_g":81,"zsir_g":1.2,"rost_g":53}'),
(61, 'Porcukor', '{"kcal":389,"feherje_g":0,"szenhidrat_g":100,"zsir_g":0,"rost_g":0}'),
(62, 'Teljes kiőrlésű kenyér', '{"kcal":247,"feherje_g":13,"szenhidrat_g":41,"zsir_g":3.4,"rost_g":7}'),
(63, 'Tonhal (konzerv, vízben)', '{"kcal":116,"feherje_g":26,"szenhidrat_g":0,"zsir_g":1,"rost_g":0}'),
(64, 'Pontyfilé', '{"kcal":127,"feherje_g":17.6,"szenhidrat_g":0,"zsir_g":5.6,"rost_g":0}'),
(65, 'Pisztráng', '{"kcal":119,"feherje_g":20.5,"szenhidrat_g":0,"zsir_g":3.5,"rost_g":0}'),
(66, 'Tőkehalfilé', '{"kcal":82,"feherje_g":18,"szenhidrat_g":0,"zsir_g":0.7,"rost_g":0}'),
(67, 'Garnélarák', '{"kcal":99,"feherje_g":24,"szenhidrat_g":0.2,"zsir_g":0.3,"rost_g":0}'),
(68, 'Kolbász', '{"kcal":330,"feherje_g":15,"szenhidrat_g":2,"zsir_g":29,"rost_g":0}'),
(69, 'Csirkecomb (bőr nélkül)', '{"kcal":121,"feherje_g":19,"szenhidrat_g":0,"zsir_g":4.7,"rost_g":0}'),
(70, 'Pulykamell', '{"kcal":104,"feherje_g":24,"szenhidrat_g":0,"zsir_g":1,"rost_g":0}'),
(71, 'Árpagyöngy', '{"kcal":352,"feherje_g":9.9,"szenhidrat_g":77.7,"zsir_g":1.2,"rost_g":15.6}'),
(72, 'Bulgur', '{"kcal":342,"feherje_g":12,"szenhidrat_g":76,"zsir_g":1.3,"rost_g":12.5}'),
(73, 'Kuszkusz', '{"kcal":376,"feherje_g":13,"szenhidrat_g":77,"zsir_g":0.6,"rost_g":5}'),
(74, 'Penne (száraztészta)', '{"kcal":371,"feherje_g":13,"szenhidrat_g":75,"zsir_g":1.5,"rost_g":3.2}'),
(75, 'Lasagne lap', '{"kcal":371,"feherje_g":13,"szenhidrat_g":75,"zsir_g":1.5,"rost_g":3.2}'),
(76, 'Tarhonya', '{"kcal":357,"feherje_g":12,"szenhidrat_g":73,"zsir_g":1.5,"rost_g":3}'),
(77, 'Vörösbab (konzerv)', '{"kcal":90,"feherje_g":6,"szenhidrat_g":14,"zsir_g":0.5,"rost_g":6}'),
(78, 'Csicseriborsó (konzerv)', '{"kcal":139,"feherje_g":7,"szenhidrat_g":22,"zsir_g":2.6,"rost_g":6}'),
(79, 'Mogyoróvaj', '{"kcal":588,"feherje_g":25,"szenhidrat_g":20,"zsir_g":50,"rost_g":6}'),
(80, 'Mandula', '{"kcal":579,"feherje_g":21,"szenhidrat_g":22,"zsir_g":50,"rost_g":12.5}'),
(81, 'Chia mag', '{"kcal":486,"feherje_g":17,"szenhidrat_g":42,"zsir_g":31,"rost_g":34}'),
(82, 'Eper', '{"kcal":32,"feherje_g":0.7,"szenhidrat_g":7.7,"zsir_g":0.3,"rost_g":2}'),
(83, 'Málna', '{"kcal":52,"feherje_g":1.2,"szenhidrat_g":12,"zsir_g":0.7,"rost_g":6.5}'),
(84, 'Áfonya', '{"kcal":57,"feherje_g":0.7,"szenhidrat_g":14,"zsir_g":0.3,"rost_g":2.4}'),
(85, 'Narancs', '{"kcal":47,"feherje_g":0.9,"szenhidrat_g":12,"zsir_g":0.1,"rost_g":2.4}'),
(86, 'Meggy', '{"kcal":50,"feherje_g":1,"szenhidrat_g":12,"zsir_g":0.3,"rost_g":1.6}'),
(87, 'Mák (őrölt)', '{"kcal":525,"feherje_g":18,"szenhidrat_g":28,"zsir_g":42,"rost_g":20}'),
(88, 'Majonéz', '{"kcal":680,"feherje_g":1,"szenhidrat_g":0.6,"zsir_g":75,"rost_g":0}'),
(89, 'Mustár', '{"kcal":66,"feherje_g":4,"szenhidrat_g":6,"zsir_g":4,"rost_g":3}'),
(90, 'Borecet', '{"kcal":19,"feherje_g":0,"szenhidrat_g":0.6,"zsir_g":0,"rost_g":0}'),
(91, 'Szójaszósz', '{"kcal":53,"feherje_g":8,"szenhidrat_g":4.9,"zsir_g":0.6,"rost_g":0.8}'),
(92, 'Gyömbér', '{"kcal":80,"feherje_g":1.8,"szenhidrat_g":18,"zsir_g":0.8,"rost_g":2}'),
(93, 'Currypor', '{"kcal":325,"feherje_g":14,"szenhidrat_g":56,"zsir_g":14,"rost_g":53}'),
(94, 'Bazsalikom (friss)', '{"kcal":23,"feherje_g":3.2,"szenhidrat_g":2.7,"zsir_g":0.6,"rost_g":1.6}'),
(95, 'Petrezselyem (zöld)', '{"kcal":36,"feherje_g":3,"szenhidrat_g":6.3,"zsir_g":0.8,"rost_g":3.3}'),
(96, 'Kapor', '{"kcal":43,"feherje_g":3.5,"szenhidrat_g":7,"zsir_g":1.1,"rost_g":2.1}'),
(97, 'Zellergumó', '{"kcal":42,"feherje_g":1.5,"szenhidrat_g":9.2,"zsir_g":0.3,"rost_g":1.8}'),
(98, 'Édesburgonya', '{"kcal":86,"feherje_g":1.6,"szenhidrat_g":20,"zsir_g":0.1,"rost_g":3}'),
(99, 'Póréhagyma', '{"kcal":61,"feherje_g":1.5,"szenhidrat_g":14,"zsir_g":0.3,"rost_g":1.8}'),
(100, 'Cékla', '{"kcal":43,"feherje_g":1.6,"szenhidrat_g":10,"zsir_g":0.2,"rost_g":2.8}'),
(101, 'Kelkáposzta', '{"kcal":27,"feherje_g":2,"szenhidrat_g":5.5,"zsir_g":0.1,"rost_g":3.1}'),
(102, 'Mazsola', '{"kcal":299,"feherje_g":3,"szenhidrat_g":79,"zsir_g":0.5,"rost_g":3.7}'),
(103, 'Szilva', '{"kcal":46,"feherje_g":0.7,"szenhidrat_g":11,"zsir_g":0.3,"rost_g":1.4}'),
(104, 'Búzadara', '{"kcal":360,"feherje_g":11,"szenhidrat_g":73,"zsir_g":1,"rost_g":3.9}'),
(105, 'Sárgabarack', '{"kcal":48,"feherje_g":1.4,"szenhidrat_g":11,"zsir_g":0.4,"rost_g":2}'),
(106, 'Zsemlemorzsa', '{"kcal":395,"feherje_g":13,"szenhidrat_g":72,"zsir_g":5,"rost_g":4}'),
(107, 'Metélt (száraztészta)', '{"kcal":371,"feherje_g":13,"szenhidrat_g":75,"zsir_g":1.5,"rost_g":3.2}');

-- ---------------------------------------------------------------------
-- Alapanyag – allergén összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "allergen_alapanyag_osszekoto" ("alapanyag_id", "allergen_id") VALUES
(1,  1),   -- Búzaliszt – glutén
(2,  3),   -- Tojás – tojás
(3,  2),   -- Tej – tej
(4,  2),   -- Vaj – tej
(15, 1),   -- Spagetti – glutén
(17, 2),   -- Tejföl – tej
(18, 2),   -- Trappista sajt – tej
(19, 6),   -- Étcsokoládé – szója (lecitin)
(24, 6),   -- Tofu – szója
(25, 1),   -- Zabpehely – glutén (keresztszennyeződés / zab-gluténfehérje)
(27, 7),   -- Lazac – hal
(28, 5),   -- Dió – diófélék
(51, 2),
(52, 2),
(53, 2),
(54, 2),
(55, 2),
(56, 2),
(62, 1),
(63, 7),
(64, 7),
(65, 7),
(66, 7),
(67, 8),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(76, 3),
(79, 4),
(80, 5),
(88, 3),
(88, 10),
(89, 10),
(90, 12),
(91, 6),
(91, 1),
(97, 9),
(104, 1),
(106, 1),
(107, 1);

-- ---------------------------------------------------------------------
-- Kategóriák
-- ---------------------------------------------------------------------
INSERT INTO "Kategoria" ("id", "kategoria") VALUES
(1, 'Leves'),
(2, 'Főétel'),
(3, 'Főzelék'),
(4, 'Desszert'),
(5, 'Reggeli'),
(6, 'Tésztaétel'),
(7, 'Halas étel'),
(8, 'Saláta'),
(9, 'Egytálételek');

-- ---------------------------------------------------------------------
-- Receptek
-- ---------------------------------------------------------------------
INSERT INTO "recept" ("id", "nev", "leiras", "adag", "ido", "kategoria_id", "kep", "tapanyagok", "lepesek") VALUES
(1, 'Gulyásleves',
 'Klasszikus magyar gulyásleves marhahússal, burgonyával és sok fűszerpaprikával.',
 4, 90, 1,
 '{"fo_kep":"/img/receptek/gulyasleves.jpg","galeria":["/img/receptek/gulyasleves-2.jpg"]}',
 '{"kcal":320,"feherje_g":24.0,"szenhidrat_g":22.0,"zsir_g":14.0,"rost_g":4.5}',
 '[{"sorszam":1,"leiras":"A vöröshagymát finomra vágjuk, és kevés olajon üvegesre pirítjuk."},
   {"sorszam":2,"leiras":"Levesszük a tűzről, belekeverjük a fűszerpaprikát, majd rátesszük a kockára vágott marhahúst."},
   {"sorszam":3,"leiras":"Felöntjük vízzel, hozzáadjuk a fokhagymát, és lassú tűzön egy órán át főzzük."},
   {"sorszam":4,"leiras":"Beletesszük a felkockázott sárgarépát, burgonyát, paprikát és paradicsomot, majd puhára főzzük."},
   {"sorszam":5,"leiras":"Sóval ízesítjük, és melegen, friss kenyérrel tálaljuk."}]'),

(2, 'Palacsinta',
 'Vékony, lágy palacsinta, amely édesen és sósan is tölthető.',
 4, 30, 4,
 '{"fo_kep":"/img/receptek/palacsinta.jpg","galeria":[]}',
 '{"kcal":280,"feherje_g":9.0,"szenhidrat_g":38.0,"zsir_g":10.0,"rost_g":1.2}',
 '[{"sorszam":1,"leiras":"A lisztet, a tojásokat, a tejet és a cukrot csomómentesre keverjük."},
   {"sorszam":2,"leiras":"A tésztát 15 percig pihentetjük."},
   {"sorszam":3,"leiras":"Kevés vajjal kikent serpenyőben mindkét oldalán aranybarnára sütjük a palacsintákat."},
   {"sorszam":4,"leiras":"Lekvárral, kakaóval vagy túróval töltve tálaljuk."}]'),

(3, 'Csirkepaprikás',
 'Krémes, tejfölös csirkepaprikás, hagyományosan galuskával tálalva.',
 4, 60, 2,
 '{"fo_kep":"/img/receptek/csirkepaprikas.jpg","galeria":["/img/receptek/csirkepaprikas-2.jpg"]}',
 '{"kcal":520,"feherje_g":38.0,"szenhidrat_g":42.0,"zsir_g":20.0,"rost_g":3.8}',
 '[{"sorszam":1,"leiras":"A vöröshagymát apróra vágjuk, és zsiradékon megdinszteljük."},
   {"sorszam":2,"leiras":"Hozzáadjuk a fűszerpaprikát, majd a kockára vágott csirkemellet, és fehéredésig pirítjuk."},
   {"sorszam":3,"leiras":"Beletesszük a paprikát és a paradicsomot, felöntjük kevés vízzel, és fedő alatt puhára főzzük."},
   {"sorszam":4,"leiras":"A tejfölt simára keverjük egy kanál liszttel, és a paprikáshoz adjuk."},
   {"sorszam":5,"leiras":"A tojásból, lisztből és vízből galuskatésztát készítünk, sós vízben kifőzzük, és a paprikással tálaljuk."}]'),

(4, 'Spagetti bolognai',
 'Gazdag, lassan főtt marhahúsos paradicsomszósz spagettivel és reszelt sajttal.',
 4, 55, 6,
 '{"fo_kep":"/img/receptek/spagetti-bolognai.jpg","galeria":[]}',
 '{"kcal":610,"feherje_g":32.0,"szenhidrat_g":78.0,"zsir_g":18.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"Olívaolajon megdinszteljük az apróra vágott hagymát és a fokhagymát."},
   {"sorszam":2,"leiras":"Hozzáadjuk a marhahúst, és színesedésig pirítjuk."},
   {"sorszam":3,"leiras":"Beletesszük a felkockázott paradicsomot, sózzuk, borsozzuk, majd 30 percig kis lángon főzzük."},
   {"sorszam":4,"leiras":"A spagettit sós vízben al dente-re főzzük, majd leszűrjük."},
   {"sorszam":5,"leiras":"A tésztát a szósszal tálaljuk, és megszórjuk reszelt trappista sajttal."}]'),

(5, 'Lencsefőzelék',
 'Egyszerű, laktató, vegán lencsefőzelék, hagymával és fokhagymával ízesítve.',
 4, 45, 3,
 '{"fo_kep":"/img/receptek/lencsefozelek.jpg","galeria":[]}',
 '{"kcal":290,"feherje_g":16.0,"szenhidrat_g":42.0,"zsir_g":6.0,"rost_g":14.0}',
 '[{"sorszam":1,"leiras":"A lencsét átmossuk, és 20 percig főzzük sós vízben a felkockázott sárgarépával."},
   {"sorszam":2,"leiras":"Olívaolajon lisztből világos rántást készítünk, hozzáadjuk a hagymát és a fokhagymát."},
   {"sorszam":3,"leiras":"A rántást fűszerpaprikával megszórjuk, majd a lencséhez keverjük."},
   {"sorszam":4,"leiras":"Még 10 percig főzzük, ízlés szerint ecettel savanyítjuk, és forrón tálaljuk."}]'),

(6, 'Zabkása banánnal és dióval',
 'Gyors, tápláló reggeli zabkása szeletelt banánnal és durvára vágott dióval.',
 2, 15, 5,
 '{"fo_kep":"/img/receptek/zabkasa.jpg","galeria":[]}',
 '{"kcal":410,"feherje_g":13.0,"szenhidrat_g":54.0,"zsir_g":16.0,"rost_g":8.0}',
 '[{"sorszam":1,"leiras":"A zabpelyhet a tejjel kis lángon 5-7 percig főzzük, közben időnként megkeverjük."},
   {"sorszam":2,"leiras":"A banánt karikákra szeljük, a diót durvára vágjuk."},
   {"sorszam":3,"leiras":"A kását tálkákba szedjük, rátesszük a banánt és a diót."}]'),

(7, 'Kókuszos tofu curry',
 'Vegán curry tofuval, spenóttal és zöldségekkel kókusztejes szószban, rizzsel.',
 3, 40, 2,
 '{"fo_kep":"/img/receptek/tofu-curry.jpg","galeria":["/img/receptek/tofu-curry-2.jpg"]}',
 '{"kcal":480,"feherje_g":18.0,"szenhidrat_g":52.0,"zsir_g":22.0,"rost_g":6.0}',
 '[{"sorszam":1,"leiras":"A rizst a csomagoláson megadott ideig főzzük, majd lecsepegtetjük."},
   {"sorszam":2,"leiras":"A tofut kockákra vágjuk, és forró serpenyőben aranybarnára sütjük."},
   {"sorszam":3,"leiras":"A hagymát, a fokhagymát és a paprikát megdinszteljük, majd felöntjük a kókusztejjel."},
   {"sorszam":4,"leiras":"Hozzáadjuk a tofut és a spenótot, 5-8 percig főzzük, amíg a szósz besűrűsödik."},
   {"sorszam":5,"leiras":"A currytt a rizzsel együtt tálaljuk."}]'),

(8, 'Sült lazac burgonyával',
 'Citromos, fokhagymás sült lazacfilé sült burgonyával, egyszerűen és gyorsan.',
 2, 35, 7,
 '{"fo_kep":"/img/receptek/sult-lazac.jpg","galeria":[]}',
 '{"kcal":540,"feherje_g":34.0,"szenhidrat_g":36.0,"zsir_g":28.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A burgonyát felszeleteljük, olívaolajjal és sóval összeforgatjuk, majd 200 fokos sütőben 15 percig sütjük."},
   {"sorszam":2,"leiras":"A lazacfilét sóval, fokhagymával és citromlével megszórjuk."},
   {"sorszam":3,"leiras":"A halat a burgonya mellé tesszük, és további 15-18 percig sütjük."},
   {"sorszam":4,"leiras":"Citromszeletekkel díszítve tálaljuk."}]'),

(9, 'Almás pite',
 'Omlós vajas tészta fahéjas almatöltelékkel, a hagyományos vasárnapi desszert.',
 8, 75, 4,
 '{"fo_kep":"/img/receptek/almas-pite.jpg","galeria":["/img/receptek/almas-pite-2.jpg"]}',
 '{"kcal":340,"feherje_g":5.0,"szenhidrat_g":48.0,"zsir_g":15.0,"rost_g":2.5}',
 '[{"sorszam":1,"leiras":"A lisztet a hideg vajjal, a cukorral és a tojássárgájával összegyúrjuk, majd 30 percre hűtőbe tesszük."},
   {"sorszam":2,"leiras":"Az almát megpucoljuk, lereszeljük, és kevés cukorral, fahéjjal összekeverjük."},
   {"sorszam":3,"leiras":"A tészta kétharmadát kinyújtjuk, és a tepsi aljára simítjuk, majd rákenjük a tölteléket."},
   {"sorszam":4,"leiras":"A maradék tésztát lereszeljük a töltelékre, és 180 fokon 35-40 percig sütjük."},
   {"sorszam":5,"leiras":"Langyosan, porcukorral megszórva tálaljuk."}]'),

(10, 'Túrós csusza',
 'Tejfölös, túrós száraztészta ropogósra sült szalonnával, a magyar konyha egyik kedvence.',
 4, 30, 6,
 '{"fo_kep":"/img/receptek/turos-csusza.jpg","galeria":[]}',
 '{"kcal":560,"feherje_g":26.0,"szenhidrat_g":62.0,"zsir_g":22.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A tésztát sós vízben kifőzzük, majd leszűrjük."},
   {"sorszam":2,"leiras":"A szalonnát kockákra vágjuk, és serpenyőben kisütjük."},
   {"sorszam":3,"leiras":"A forró tésztát elkeverjük a zsírjával, a morzsolt túróval és a tejföllel."},
   {"sorszam":4,"leiras":"A tetejére szórjuk a ropogós szalonnát, és azonnal tálaljuk."}]'),

(11, 'Spagetti carbonara',
 'Krémes, tejszín nélküli carbonara szalonnával, tojással és parmezánnal.',
 2, 25, 6,
 '{"fo_kep":"/img/receptek/spagetti-carbonara.jpg","galeria":[]}',
 '{"kcal":690,"feherje_g":28.0,"szenhidrat_g":70.0,"zsir_g":32.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A spagettit sós vízben al dente-re főzzük."},
   {"sorszam":2,"leiras":"A szalonnát kockázva kisütjük."},
   {"sorszam":3,"leiras":"A tojásokat a reszelt parmezánnal összekeverjük."},
   {"sorszam":4,"leiras":"A leszűrt tésztát a szalonnához keverjük, levesszük a tűzről, és hozzáadjuk a tojásos keveréket."},
   {"sorszam":5,"leiras":"Gyorsan átforgatjuk, hogy krémes legyen, és borssal megszórva tálaljuk."}]'),

(12, 'Penne arrabbiata',
 'Tüzes paradicsomos tészta fokhagymával és friss bazsalikommal, vegán.',
 3, 25, 6,
 '{"fo_kep":"/img/receptek/penne-arrabbiata.jpg","galeria":[]}',
 '{"kcal":480,"feherje_g":14.0,"szenhidrat_g":80.0,"zsir_g":11.0,"rost_g":6.0}',
 '[{"sorszam":1,"leiras":"A fokhagymát olívaolajon enyhén megpirítjuk."},
   {"sorszam":2,"leiras":"Hozzáadjuk a paradicsompürét és a kevés vizet, majd 10 percig főzzük."},
   {"sorszam":3,"leiras":"Csípős paprikával vagy borssal ízesítjük."},
   {"sorszam":4,"leiras":"A főtt pennét a szószba forgatjuk, és friss bazsalikommal tálaljuk."}]'),

(13, 'Lasagne bolognai',
 'Rétegelt tészta húsos paradicsomszósszal, besamellel és olvadt mozzarellával.',
 6, 90, 6,
 '{"fo_kep":"/img/receptek/lasagne-bolognai.jpg","galeria":[]}',
 '{"kcal":640,"feherje_g":34.0,"szenhidrat_g":52.0,"zsir_g":31.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A hagymát megdinszteljük, hozzáadjuk a marhahúst és a paradicsompürét, majd 30 percig főzzük."},
   {"sorszam":2,"leiras":"A vajból, lisztből és tejből sűrű besamelmártást készítünk."},
   {"sorszam":3,"leiras":"Egy tepsiben rétegezzük a lasagne-lapokat, a húsos szószt és a besamelt."},
   {"sorszam":4,"leiras":"A tetejére mozzarellát szórunk, és 180 fokon 35 percig sütjük."},
   {"sorszam":5,"leiras":"Tálalás előtt 10 percet pihentetjük."}]'),

(14, 'Gombás-tejszínes penne',
 'Selymes gombamártás fokhagymával és friss petrezselyemmel.',
 3, 30, 6,
 '{"fo_kep":"/img/receptek/gombas-tejszines-penne.jpg","galeria":[]}',
 '{"kcal":590,"feherje_g":19.0,"szenhidrat_g":68.0,"zsir_g":26.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A pennét sós vízben megfőzzük."},
   {"sorszam":2,"leiras":"A szeletelt gombát és a fokhagymát olívaolajon aranyszínűre sütjük."},
   {"sorszam":3,"leiras":"Felöntjük a tejszínnel, és 5 percig főzzük."},
   {"sorszam":4,"leiras":"A tésztát a mártásba keverjük, parmezánnal és petrezselyemmel megszórjuk."}]'),

(15, 'Bazsalikomos-mandulás spagetti',
 'Friss bazsalikomos pesto mandulával és parmezánnal, villámgyors vacsora.',
 3, 20, 6,
 '{"fo_kep":"/img/receptek/bazsalikomos-mandulas-spagetti.jpg","galeria":[]}',
 '{"kcal":620,"feherje_g":20.0,"szenhidrat_g":66.0,"zsir_g":30.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A spagettit sós vízben kifőzzük."},
   {"sorszam":2,"leiras":"A bazsalikomot, a mandulát, a fokhagymát és a parmezánt olívaolajjal botmixerrel péppé turmixoljuk."},
   {"sorszam":3,"leiras":"A tésztát a pestóval összeforgatjuk, kevés főzővízzel lazítjuk."},
   {"sorszam":4,"leiras":"Parmezánnal megszórva tálaljuk."}]'),

(16, 'Húsleves',
 'Tiszta, aranyszínű csirkehúsleves zöldségekkel és cérnametélttel.',
 6, 120, 1,
 '{"fo_kep":"/img/receptek/husleves.jpg","galeria":[]}',
 '{"kcal":240,"feherje_g":22.0,"szenhidrat_g":20.0,"zsir_g":7.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A csirkecombot hideg vízben feltesszük, és a habját leszedjük."},
   {"sorszam":2,"leiras":"Hozzáadjuk a sárgarépát, a zellergumót, a hagymát és a petrezselymet."},
   {"sorszam":3,"leiras":"Kis lángon 1,5 órán át főzzük."},
   {"sorszam":4,"leiras":"A levest leszűrjük, a zöldségeket és a húst visszatesszük."},
   {"sorszam":5,"leiras":"A cérnametéltet külön kifőzzük, és a levesbe tesszük tálaláskor."}]'),

(17, 'Paradicsomleves',
 'Gazdag, selymes paradicsomleves rizzsel és friss bazsalikommal.',
 4, 40, 1,
 '{"fo_kep":"/img/receptek/paradicsomleves.jpg","galeria":[]}',
 '{"kcal":210,"feherje_g":5.0,"szenhidrat_g":34.0,"zsir_g":6.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A vajon megfuttatjuk a paradicsompürét, majd hozzáadjuk a felkockázott paradicsomot."},
   {"sorszam":2,"leiras":"Felöntjük vízzel, és 20 percig főzzük."},
   {"sorszam":3,"leiras":"A rizst külön kifőzzük, majd a levesbe tesszük."},
   {"sorszam":4,"leiras":"Cukorral ízesítjük, és friss bazsalikommal tálaljuk."}]'),

(18, 'Gombaleves',
 'Tejfölös, paprikás gombaleves, tavaszi-őszi kedvenc.',
 4, 35, 1,
 '{"fo_kep":"/img/receptek/gombaleves.jpg","galeria":[]}',
 '{"kcal":190,"feherje_g":6.0,"szenhidrat_g":16.0,"zsir_g":12.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A hagymát vajon megdinszteljük, és hozzáadjuk a szeletelt gombát."},
   {"sorszam":2,"leiras":"Fűszerpaprikával megszórjuk, majd felöntjük vízzel, és 15 percig főzzük."},
   {"sorszam":3,"leiras":"A tejfölt a liszttel simára keverjük, és a levesbe csorgatjuk."},
   {"sorszam":4,"leiras":"Petrezselymet szórunk a tetejére, és melegen tálaljuk."}]'),

(19, 'Sütőtök krémleves',
 'Édeskés, krémes sütőtökleves gyömbérrel és tejszínnel.',
 4, 40, 1,
 '{"fo_kep":"/img/receptek/sutotok-kremleves.jpg","galeria":[]}',
 '{"kcal":230,"feherje_g":4.0,"szenhidrat_g":22.0,"zsir_g":14.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A hagymát és a fokhagymát olívaolajon megpirítjuk."},
   {"sorszam":2,"leiras":"Hozzáadjuk a kockára vágott sütőtököt és a reszelt gyömbért."},
   {"sorszam":3,"leiras":"Vízzel felöntjük, és puhára főzzük, majd botmixerrel pürésítjük."},
   {"sorszam":4,"leiras":"Habtejszínnel elkeverve tálaljuk."}]'),

(20, 'Hideg meggyleves',
 'Hagyományos nyári gyümölcsleves fahéjjal és tejszínnel.',
 6, 30, 1,
 '{"fo_kep":"/img/receptek/hideg-meggyleves.jpg","galeria":[]}',
 '{"kcal":180,"feherje_g":2.0,"szenhidrat_g":28.0,"zsir_g":7.0,"rost_g":2.0}',
 '[{"sorszam":1,"leiras":"A meggyet kevés vízzel és fahéjjal felforraljuk."},
   {"sorszam":2,"leiras":"Cukorral ízesítjük, és puhára főzzük."},
   {"sorszam":3,"leiras":"Hozzáadjuk a habtejszínt, majd kihűtjük."},
   {"sorszam":4,"leiras":"Hidegen, hűtve tálaljuk."}]'),

(21, 'Korhelyleves',
 'Savanyú káposztás, kolbászos, tejfölös leves, a hajnali ébredés jó barátja.',
 4, 45, 1,
 '{"fo_kep":"/img/receptek/korhelyleves.jpg","galeria":[]}',
 '{"kcal":360,"feherje_g":16.0,"szenhidrat_g":22.0,"zsir_g":23.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A szalonnát kockázva kisütjük, majd hozzáadjuk a hagymát."},
   {"sorszam":2,"leiras":"Fűszerpaprikát szórunk rá, majd a savanyú káposztát és a szeletelt kolbászt."},
   {"sorszam":3,"leiras":"Felöntjük vízzel, 25 percig főzzük."},
   {"sorszam":4,"leiras":"A lisztet a tejföllel elkeverjük, és behabarjuk a levest."}]'),

(22, 'Rántott csirkemell',
 'Aranybarnára sült, ropogós bundás csirkemell, bármilyen körettel.',
 4, 40, 2,
 '{"fo_kep":"/img/receptek/rantott-csirkemell.jpg","galeria":[]}',
 '{"kcal":480,"feherje_g":38.0,"szenhidrat_g":28.0,"zsir_g":24.0,"rost_g":2.0}',
 '[{"sorszam":1,"leiras":"A csirkemellet szeletekre vágjuk, kiklopfoljuk, sózzuk."},
   {"sorszam":2,"leiras":"Egymás után lisztbe, felvert tojásba és zsemlemorzsába forgatjuk."},
   {"sorszam":3,"leiras":"Bő, forró olajban mindkét oldalán aranyszínűre sütjük."},
   {"sorszam":4,"leiras":"Papírtörlőn lecsepegtetjük, és citromos körettel tálaljuk."}]'),

(23, 'Töltött káposzta',
 'Fűszeres húsos-rizses töltelék savanyú káposztalevélben, füstölt szalonnával főzve.',
 6, 150, 2,
 '{"fo_kep":"/img/receptek/toltott-kaposzta.jpg","galeria":[]}',
 '{"kcal":430,"feherje_g":20.0,"szenhidrat_g":38.0,"zsir_g":22.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A darált húst a rizzsel, a hagymával és a fűszerpaprikával összekeverjük."},
   {"sorszam":2,"leiras":"A káposztaleveleket megtöltjük, és szorosan összetekerjük."},
   {"sorszam":3,"leiras":"A szalonnát a fazék aljára tesszük, rárakjuk a tekercseket és a maradék káposztát."},
   {"sorszam":4,"leiras":"Vízzel feltöltjük, és 1,5-2 órán át lassan főzzük."},
   {"sorszam":5,"leiras":"Tejföllel tálaljuk."}]'),

(24, 'Sertéspörkölt nokedlivel',
 'Lassan főtt paprikás sertéspörkölt házi galuskával.',
 4, 100, 2,
 '{"fo_kep":"/img/receptek/sertesporkolt-nokedlivel.jpg","galeria":[]}',
 '{"kcal":620,"feherje_g":36.0,"szenhidrat_g":58.0,"zsir_g":26.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A hagymát megdinszteljük, levesszük a tűzről, és fűszerpaprikát keverünk bele."},
   {"sorszam":2,"leiras":"Hozzáadjuk a kockára vágott sertéskarajt, és kevés vízzel puhára pároljuk."},
   {"sorszam":3,"leiras":"A paprikát és a paradicsomot a végén tesszük hozzá."},
   {"sorszam":4,"leiras":"A lisztből és tojásból nokedlitésztát készítünk, sós vízben kifőzzük."},
   {"sorszam":5,"leiras":"A pörköltet a galuskával tálaljuk."}]'),

(25, 'Cigánypecsenye',
 'Fokhagymás-mustáros sertésszelet serpenyőben sütve.',
 4, 35, 2,
 '{"fo_kep":"/img/receptek/ciganypecsenye.jpg","galeria":[]}',
 '{"kcal":380,"feherje_g":32.0,"szenhidrat_g":4.0,"zsir_g":26.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"A karajszeleteket kiklopfoljuk, sózzuk, borsozzuk."},
   {"sorszam":2,"leiras":"Fokhagymával és mustárral bedörzsöljük, majd 20 percig pihentetjük."},
   {"sorszam":3,"leiras":"Forró olajon mindkét oldalon megsütjük."},
   {"sorszam":4,"leiras":"A hagymagyűrűkkel és friss kenyérrel tálaljuk."}]'),

(26, 'Mustáros pulykamell',
 'Gyengéd pulykamell krémes mustáros-hagymás szószban.',
 3, 35, 2,
 '{"fo_kep":"/img/receptek/mustaros-pulykamell.jpg","galeria":[]}',
 '{"kcal":330,"feherje_g":36.0,"szenhidrat_g":6.0,"zsir_g":17.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"A pulykamellet szeletekre vágjuk, és sóval, borssal fűszerezzük."},
   {"sorszam":2,"leiras":"Serpenyőben aranybarnára sütjük, majd kivesszük."},
   {"sorszam":3,"leiras":"A hagymát megdinszteljük, hozzáadjuk a mustárt és a tejszínt."},
   {"sorszam":4,"leiras":"A húst visszatesszük a szószba, és 5 percig főzzük."}]'),

(27, 'Sült csirkecomb sült zöldségekkel',
 'Egytepsis csirkecomb fokhagymás burgonyával, sárgarépával és cukkinivel.',
 4, 60, 2,
 '{"fo_kep":"/img/receptek/sult-csirkecomb-sult-zoldsegekkel.jpg","galeria":[]}',
 '{"kcal":450,"feherje_g":30.0,"szenhidrat_g":32.0,"zsir_g":20.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A zöldségeket felkockázzuk, olívaolajjal és sóval összeforgatjuk."},
   {"sorszam":2,"leiras":"A csirkecombokat fokhagymával bedörzsöljük, és a zöldségekre fektetjük."},
   {"sorszam":3,"leiras":"200 fokos sütőben 45-50 percig sütjük."},
   {"sorszam":4,"leiras":"Félidőben megforgatjuk, hogy minden oldala szépen megpiruljon."}]'),

(28, 'Zöldborsófőzelék',
 'Klasszikus tejfölös zöldborsófőzelék, egyszerűen és gyorsan.',
 4, 30, 3,
 '{"fo_kep":"/img/receptek/zoldborsofozelek.jpg","galeria":[]}',
 '{"kcal":210,"feherje_g":9.0,"szenhidrat_g":28.0,"zsir_g":7.0,"rost_g":7.0}',
 '[{"sorszam":1,"leiras":"A zöldborsót sós vízben puhára főzzük."},
   {"sorszam":2,"leiras":"A vajból és lisztből világos rántást készítünk, és a borsóhoz keverjük."},
   {"sorszam":3,"leiras":"Tejföllel simítjuk, petrezselyemmel megszórjuk."},
   {"sorszam":4,"leiras":"Pár percig még főzzük, hogy összeérjenek az ízek."}]'),

(29, 'Tökfőzelék',
 'Frissen reszelt cukkinis főzelék kaporral, ecettel és tejföllel.',
 4, 30, 3,
 '{"fo_kep":"/img/receptek/tokfozelek.jpg","galeria":[]}',
 '{"kcal":170,"feherje_g":4.0,"szenhidrat_g":20.0,"zsir_g":8.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A cukkinit lereszeljük, sózzuk, és 10 percig állni hagyjuk."},
   {"sorszam":2,"leiras":"Kevés olajon összefőzzük a liszttel és a tejföllel."},
   {"sorszam":3,"leiras":"Kaporral, ecettel és egy csipet cukorral ízesítjük."},
   {"sorszam":4,"leiras":"Hagyományosan sült tojással vagy fasírttal tálaljuk."}]'),

(30, 'Spenótfőzelék tükörtojással',
 'Krémes spenótfőzelék fokhagymával, tetején tükörtojással.',
 3, 25, 3,
 '{"fo_kep":"/img/receptek/spenotfozelek-tukortojassal.jpg","galeria":[]}',
 '{"kcal":280,"feherje_g":13.0,"szenhidrat_g":14.0,"zsir_g":19.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A spenótot megpároljuk, majd botmixerrel összeturmixoljuk."},
   {"sorszam":2,"leiras":"A vajból és lisztből rántást készítünk, a spenóthoz keverjük."},
   {"sorszam":3,"leiras":"A tejszínnel és a fokhagymával ízesítjük."},
   {"sorszam":4,"leiras":"A tojásokat tükörtojásnak megsütjük, és a főzelékre tesszük."}]'),

(31, 'Zöldbabfőzelék',
 'Frissen főzött zöldbab fokhagymás-tejfölös habarással.',
 4, 30, 3,
 '{"fo_kep":"/img/receptek/zoldbabfozelek.jpg","galeria":[]}',
 '{"kcal":160,"feherje_g":5.0,"szenhidrat_g":22.0,"zsir_g":6.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A zöldbabot sós vízben megfőzzük."},
   {"sorszam":2,"leiras":"Rántást készítünk, és a babhoz keverjük."},
   {"sorszam":3,"leiras":"Fokhagymát és kevés ecetet adunk hozzá."},
   {"sorszam":4,"leiras":"Tejfölt keverünk bele, és még egyszer felforraljuk."}]'),

(32, 'Burgonyafőzelék kolbásszal',
 'Paprikás burgonyafőzelék, tetején szeletelt füstölt kolbásszal.',
 4, 40, 3,
 '{"fo_kep":"/img/receptek/burgonyafozelek-kolbasszal.jpg","galeria":[]}',
 '{"kcal":410,"feherje_g":13.0,"szenhidrat_g":40.0,"zsir_g":22.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A burgonyát kockára vágjuk, és sós vízben félpuhára főzzük."},
   {"sorszam":2,"leiras":"Olajon rántást készítünk, hozzáadjuk a hagymát és a fűszerpaprikát."},
   {"sorszam":3,"leiras":"A rántást a krumplihoz keverjük, és sűrűre főzzük."},
   {"sorszam":4,"leiras":"A kolbászt szeleteljük, megsütjük, és a főzelékre tesszük."}]'),

(33, 'Kelkáposzta-főzelék',
 'Klasszikus, sűrű kelkáposztafőzelék pirított hagymával és tejföllel.',
 4, 40, 3,
 '{"fo_kep":"/img/receptek/kelkaposzta-fozelek.jpg","galeria":[]}',
 '{"kcal":180,"feherje_g":6.0,"szenhidrat_g":22.0,"zsir_g":8.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A kelkáposztát lereszeljük, és sós vízben puhára főzzük."},
   {"sorszam":2,"leiras":"Olajon aranybarnára pirítjuk a hagymát és a lisztet."},
   {"sorszam":3,"leiras":"A rántást a káposztához keverjük, felforraljuk."},
   {"sorszam":4,"leiras":"Tejföllel simítva tálaljuk."}]'),

(34, 'Túrógombóc',
 'Lágy, túrós gombócok vajon pirított zsemlemorzsában, porcukorral és tejföllel.',
 6, 50, 4,
 '{"fo_kep":"/img/receptek/turogomboc.jpg","galeria":[]}',
 '{"kcal":340,"feherje_g":15.0,"szenhidrat_g":35.0,"zsir_g":15.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"A túrót a búzadarával, a tojással és kevés cukorral összegyúrjuk."},
   {"sorszam":2,"leiras":"A tésztát 30 percig pihentetjük, majd gombócokat formálunk belőle."},
   {"sorszam":3,"leiras":"Sós, forrásban lévő vízben 10-12 percig főzzük."},
   {"sorszam":4,"leiras":"A zsemlemorzsát vajon aranybarnára pirítjuk, és belegörgetjük a gombócokat."},
   {"sorszam":5,"leiras":"Tejföllel és porcukorral szórva tálaljuk."}]'),

(35, 'Mákos tészta',
 'Egyszerű, édes mákos metélt vajjal és porcukorral, gyerekkori kedvenc.',
 4, 20, 4,
 '{"fo_kep":"/img/receptek/makos-teszta.jpg","galeria":[]}',
 '{"kcal":410,"feherje_g":12.0,"szenhidrat_g":58.0,"zsir_g":15.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A metéltet sós vízben megfőzzük, és leszűrjük."},
   {"sorszam":2,"leiras":"A vajat megolvasztjuk, és a tésztát belefordítjuk."},
   {"sorszam":3,"leiras":"Őrölt mákkal és porcukorral keverjük össze."},
   {"sorszam":4,"leiras":"Melegen tálaljuk."}]'),

(36, 'Csokoládés brownie',
 'Sűrű, belül puha csokis brownie durvára vágott dióval.',
 12, 45, 4,
 '{"fo_kep":"/img/receptek/csokolades-brownie.jpg","galeria":[]}',
 '{"kcal":310,"feherje_g":5.0,"szenhidrat_g":32.0,"zsir_g":19.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A csokoládét a vajjal vízgőz felett megolvasztjuk."},
   {"sorszam":2,"leiras":"A tojásokat a cukorral habosra keverjük, hozzáadjuk a csokoládés keveréket."},
   {"sorszam":3,"leiras":"A liszttel és a kakaóporral óvatosan elkeverjük, hozzáadjuk a diót."},
   {"sorszam":4,"leiras":"Sütőpapíros tepsiben 175 fokon 25 percig sütjük."}]'),

(37, 'Epres joghurtos pohárkrém',
 'Villámgyors, könnyű desszert eperrel, joghurttal és mézzel.',
 4, 15, 4,
 '{"fo_kep":"/img/receptek/epres-joghurtos-poharkrem.jpg","galeria":[]}',
 '{"kcal":190,"feherje_g":6.0,"szenhidrat_g":22.0,"zsir_g":9.0,"rost_g":2.0}',
 '[{"sorszam":1,"leiras":"Az epret megmossuk, felvágjuk, és mézzel összekeverjük."},
   {"sorszam":2,"leiras":"A habtejszínt kemény habbá verjük, és a joghurttal óvatosan összeforgatjuk."},
   {"sorszam":3,"leiras":"Poharakba rétegezzük az epret és a joghurtkrémet."},
   {"sorszam":4,"leiras":"Tálalásig hűtjük."}]'),

(38, 'Rizsfelfújt barackkal',
 'Könnyű, habos rizsfelfújt, sárgabaracklekvárral vagy friss barackkal.',
 6, 60, 4,
 '{"fo_kep":"/img/receptek/rizsfelfujt-barackkal.jpg","galeria":[]}',
 '{"kcal":300,"feherje_g":8.0,"szenhidrat_g":48.0,"zsir_g":9.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"A rizst tejben puhára főzzük, majd hagyjuk kihűlni."},
   {"sorszam":2,"leiras":"A tojások sárgáját a cukorral és a vajjal elkeverjük, a rizshez adjuk."},
   {"sorszam":3,"leiras":"A fehérjéket kemény habbá verjük, és óvatosan beleforgatjuk."},
   {"sorszam":4,"leiras":"Kivajazott tepsiben 180 fokon 30 percig sütjük."},
   {"sorszam":5,"leiras":"Sárgabarackkal tálaljuk."}]'),

(39, 'Szilvás lepény',
 'Omlós vajas tészta, tetején fahéjas szilvaszeletekkel.',
 10, 55, 4,
 '{"fo_kep":"/img/receptek/szilvas-lepeny.jpg","galeria":[]}',
 '{"kcal":280,"feherje_g":4.0,"szenhidrat_g":40.0,"zsir_g":12.0,"rost_g":2.0}',
 '[{"sorszam":1,"leiras":"A lisztet a vajjal, a cukorral és a tojással összegyúrjuk, tejjel lazítjuk."},
   {"sorszam":2,"leiras":"A tésztát tepsibe nyújtjuk."},
   {"sorszam":3,"leiras":"A szilvát félbevágjuk, és sűrűn a tésztára rakjuk, fahéjjal megszórjuk."},
   {"sorszam":4,"leiras":"180 fokon 35-40 percig sütjük."}]'),

(40, 'Sonkás rántotta pirítóssal',
 'Krémes rántotta főtt sonkával és paprikával, teljes kiőrlésű pirítóssal.',
 2, 15, 5,
 '{"fo_kep":"/img/receptek/sonkas-rantotta-piritossal.jpg","galeria":[]}',
 '{"kcal":380,"feherje_g":24.0,"szenhidrat_g":18.0,"zsir_g":24.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A sonkát és a paprikát apróra vágjuk."},
   {"sorszam":2,"leiras":"Vajon megpirítjuk, majd ráöntjük a felvert tojásokat."},
   {"sorszam":3,"leiras":"Kevergetve, lágyan összeállítjuk."},
   {"sorszam":4,"leiras":"A kenyeret megpirítjuk, és a rántottával tálaljuk."}]'),

(41, 'Chia puding málnával',
 'Előző este elkészíthető, kényelmes reggeli tejjel és mézzel.',
 2, 10, 5,
 '{"fo_kep":"/img/receptek/chia-puding-malnaval.jpg","galeria":[]}',
 '{"kcal":260,"feherje_g":9.0,"szenhidrat_g":28.0,"zsir_g":12.0,"rost_g":12.0}',
 '[{"sorszam":1,"leiras":"A chia magot a tejjel és a mézzel összekeverjük."},
   {"sorszam":2,"leiras":"Hűtőben legalább 4 órát, ideálisan egy éjszakát állni hagyjuk."},
   {"sorszam":3,"leiras":"Reggel málnával megszórjuk."},
   {"sorszam":4,"leiras":"Hidegen tálaljuk."}]'),

(42, 'Mogyoróvajas banános pirítós',
 'Gyors, laktató reggeli: pirított kenyér mogyoróvajjal és banánkarikákkal.',
 1, 5, 5,
 '{"fo_kep":"/img/receptek/mogyorovajas-bananos-piritos.jpg","galeria":[]}',
 '{"kcal":390,"feherje_g":13.0,"szenhidrat_g":48.0,"zsir_g":16.0,"rost_g":8.0}',
 '[{"sorszam":1,"leiras":"A kenyeret megpirítjuk."},
   {"sorszam":2,"leiras":"Megkenjük mogyoróvajjal."},
   {"sorszam":3,"leiras":"A banánt karikákra vágjuk, és a tetejére tesszük."}]'),

(43, 'Joghurtos müzli áfonyával',
 'Hideg, tápláló tál zabbal, áfonyával, dióval és mézzel.',
 2, 10, 5,
 '{"fo_kep":"/img/receptek/joghurtos-muzli-afonyaval.jpg","galeria":[]}',
 '{"kcal":350,"feherje_g":12.0,"szenhidrat_g":48.0,"zsir_g":13.0,"rost_g":7.0}',
 '[{"sorszam":1,"leiras":"A zabpelyhet tálkákba szedjük."},
   {"sorszam":2,"leiras":"Ráöntjük a natúr joghurtot."},
   {"sorszam":3,"leiras":"Áfonyával és durvára vágott dióval megszórjuk."},
   {"sorszam":4,"leiras":"Mézzel meglocsolva tálaljuk."}]'),

(44, 'Sonkás-sajtos melegszendvics',
 'Olvadt sajtos, sonkás szendvics ropogós kenyéren.',
 2, 15, 5,
 '{"fo_kep":"/img/receptek/sonkas-sajtos-melegszendvics.jpg","galeria":[]}',
 '{"kcal":360,"feherje_g":20.0,"szenhidrat_g":30.0,"zsir_g":18.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A kenyérszeletek egyik oldalát megvajazzuk."},
   {"sorszam":2,"leiras":"Sonkát és szeletelt sajtot teszünk közéjük."},
   {"sorszam":3,"leiras":"Serpenyőben mindkét oldalán aranybarnára sütjük, amíg a sajt megolvad."}]'),

(45, 'Rántott ponty',
 'Ropogós bundás pontyszelet, hagyományos karácsonyi fogás.',
 4, 45, 7,
 '{"fo_kep":"/img/receptek/rantott-ponty.jpg","galeria":[]}',
 '{"kcal":430,"feherje_g":26.0,"szenhidrat_g":22.0,"zsir_g":26.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"A pontyfilét sóval és citromlével megszórjuk."},
   {"sorszam":2,"leiras":"Lisztbe, tojásba és zsemlemorzsába forgatjuk."},
   {"sorszam":3,"leiras":"Forró olajban mindkét oldalon aranybarnára sütjük."},
   {"sorszam":4,"leiras":"Citromkarikával és burgonyasalátával tálaljuk."}]'),

(46, 'Sült pisztráng citrommal',
 'Egész sült pisztráng petrezselymes, citromos vajjal.',
 2, 35, 7,
 '{"fo_kep":"/img/receptek/sult-pisztrang-citrommal.jpg","galeria":[]}',
 '{"kcal":360,"feherje_g":32.0,"szenhidrat_g":8.0,"zsir_g":22.0,"rost_g":2.0}',
 '[{"sorszam":1,"leiras":"A pisztrángot megtisztítjuk, sózzuk, belsejét citromszeletekkel és petrezselyemmel töltjük."},
   {"sorszam":2,"leiras":"Vajjal megkenjük, és sütőpapíron 190 fokra előmelegített sütőbe tesszük."},
   {"sorszam":3,"leiras":"20-25 percig sütjük."},
   {"sorszam":4,"leiras":"Párolt vagy sült burgonyával tálaljuk."}]'),

(47, 'Tőkehal paradicsomos-olívás szószban',
 'Mediterrán stílusú tőkehal fokhagymás paradicsomszószban fekete olajbogyóval.',
 3, 35, 7,
 '{"fo_kep":"/img/receptek/tokehal-paradicsomos-olivas-szoszban.jpg","galeria":[]}',
 '{"kcal":290,"feherje_g":28.0,"szenhidrat_g":10.0,"zsir_g":14.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A hagymát és a fokhagymát olívaolajon megdinszteljük."},
   {"sorszam":2,"leiras":"Hozzáadjuk a paradicsomot és az olajbogyót, 10 percig főzzük."},
   {"sorszam":3,"leiras":"A halfilét a szószba fektetjük."},
   {"sorszam":4,"leiras":"Fedő alatt 8-10 percig pároljuk."}]'),

(48, 'Fokhagymás garnélarák vajon',
 'Gyors fokhagymás, citromos garnélarák petrezselyemmel.',
 2, 15, 7,
 '{"fo_kep":"/img/receptek/fokhagymas-garnelarak-vajon.jpg","galeria":[]}',
 '{"kcal":260,"feherje_g":28.0,"szenhidrat_g":4.0,"zsir_g":14.0,"rost_g":0.0}',
 '[{"sorszam":1,"leiras":"A vajat serpenyőben felolvasztjuk, hozzáadjuk a zúzott fokhagymát."},
   {"sorszam":2,"leiras":"A garnélarákot 2-3 perc alatt mindkét oldalán megsütjük."},
   {"sorszam":3,"leiras":"Citromlével meglocsoljuk, petrezselyemmel megszórjuk."}]'),

(49, 'Halászlé',
 'Fűszerpaprikás, tüzes halászlé ponttyal, hagyományos tiszai módon.',
 6, 70, 7,
 '{"fo_kep":"/img/receptek/halaszle.jpg","galeria":[]}',
 '{"kcal":310,"feherje_g":28.0,"szenhidrat_g":12.0,"zsir_g":16.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A hagymát vízben puhára főzzük, majd áttörjük."},
   {"sorszam":2,"leiras":"Fűszerpaprikát, paradicsomot és paprikát adunk hozzá."},
   {"sorszam":3,"leiras":"Beletesszük a felszeletelt ponty darabokat."},
   {"sorszam":4,"leiras":"Kis lángon 20 percig főzzük, a halat nem keverjük."},
   {"sorszam":5,"leiras":"Csípős paprikával és friss kenyérrel tálaljuk."}]'),

(50, 'Görög saláta',
 'Friss paradicsomos-uborkás saláta fetával és fekete olajbogyóval.',
 3, 15, 8,
 '{"fo_kep":"/img/receptek/gorog-salata.jpg","galeria":[]}',
 '{"kcal":230,"feherje_g":7.0,"szenhidrat_g":10.0,"zsir_g":18.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A paradicsomot és az uborkát nagyobb darabokra vágjuk."},
   {"sorszam":2,"leiras":"A hagymát vékony karikákra szeljük."},
   {"sorszam":3,"leiras":"Hozzáadjuk az olajbogyót és a kockára vágott fetát."},
   {"sorszam":4,"leiras":"Olívaolajjal és citromlével ízesítjük."}]'),

(51, 'Csirkés cézársaláta',
 'Ropogós saláta grillcsirkével, parmezánnal és pirított kenyérkockákkal.',
 2, 25, 8,
 '{"fo_kep":"/img/receptek/csirkes-cezarsalata.jpg","galeria":[]}',
 '{"kcal":430,"feherje_g":32.0,"szenhidrat_g":18.0,"zsir_g":26.0,"rost_g":3.0}',
 '[{"sorszam":1,"leiras":"A csirkemellet megsütjük, és csíkokra vágjuk."},
   {"sorszam":2,"leiras":"A kenyeret kockázzuk, és ropogósra pirítjuk."},
   {"sorszam":3,"leiras":"A majonézt citromlével és reszelt parmezánnal elkeverjük."},
   {"sorszam":4,"leiras":"A salátát a csirkével, a kenyérkockákkal és a dresszinggel összeforgatjuk."}]'),

(52, 'Tonhalsaláta',
 'Laktató saláta tonhallal, csemegekukoricával és főtt tojással.',
 2, 15, 8,
 '{"fo_kep":"/img/receptek/tonhalsalata.jpg","galeria":[]}',
 '{"kcal":310,"feherje_g":28.0,"szenhidrat_g":14.0,"zsir_g":16.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A tojásokat keményre főzzük, és negyedeljük."},
   {"sorszam":2,"leiras":"A salátát megmossuk, és tálba tépjük."},
   {"sorszam":3,"leiras":"Hozzáadjuk a paradicsomot, a kukoricát és a lecsepegtetett tonhalat."},
   {"sorszam":4,"leiras":"Olívaolajjal meglocsoljuk."}]'),

(53, 'Céklasaláta rukkolával',
 'Sült cékla rukkolával, fetával, dióval és mézes dresszinggel.',
 2, 45, 8,
 '{"fo_kep":"/img/receptek/ceklasalata-rukkolaval.jpg","galeria":[]}',
 '{"kcal":310,"feherje_g":8.0,"szenhidrat_g":24.0,"zsir_g":20.0,"rost_g":6.0}',
 '[{"sorszam":1,"leiras":"A céklát megsütjük vagy megfőzzük, majd meghámozzuk és felkockázzuk."},
   {"sorszam":2,"leiras":"A rukkolát tálba tesszük, rárakjuk a céklát."},
   {"sorszam":3,"leiras":"Morzsolt fetát és diót szórunk rá."},
   {"sorszam":4,"leiras":"Olívaolajból és mézből dresszinget készítünk, és ráöntjük."}]'),

(54, 'Tejfölös uborkasaláta',
 'Frissítő, hagyományos fokhagymás uborkasaláta tejföllel.',
 4, 15, 8,
 '{"fo_kep":"/img/receptek/tejfolos-uborkasalata.jpg","galeria":[]}',
 '{"kcal":100,"feherje_g":2.0,"szenhidrat_g":8.0,"zsir_g":6.0,"rost_g":1.0}',
 '[{"sorszam":1,"leiras":"Az uborkát vékonyra szeleteljük, és megsózzuk, majd kinyomkodjuk."},
   {"sorszam":2,"leiras":"Hozzáadjuk a zúzott fokhagymát és az ecetet."},
   {"sorszam":3,"leiras":"Tejföllel összekeverjük, és paprikával megszórjuk."}]'),

(55, 'Rakott krumpli',
 'Rétegelt burgonya főtt tojással, kolbásszal és tejföllel.',
 6, 75, 9,
 '{"fo_kep":"/img/receptek/rakott-krumpli.jpg","galeria":[]}',
 '{"kcal":560,"feherje_g":20.0,"szenhidrat_g":42.0,"zsir_g":34.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A burgonyát héjában megfőzzük, meghámozzuk, és karikákra szeleteljük."},
   {"sorszam":2,"leiras":"A tojásokat keményre főzzük, és szeleteljük."},
   {"sorszam":3,"leiras":"Kivajazott tepsiben rétegezzük a burgonyát, a tojást, a kolbászt és a tejfölt."},
   {"sorszam":4,"leiras":"A tetejére tejfölt kenünk, és 200 fokon 30 percig sütjük."}]'),

(56, 'Kolbászos lecsó',
 'Paprikás-paradicsomos lecsó füstölt kolbásszal.',
 4, 35, 9,
 '{"fo_kep":"/img/receptek/kolbaszos-lecso.jpg","galeria":[]}',
 '{"kcal":380,"feherje_g":14.0,"szenhidrat_g":20.0,"zsir_g":28.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A hagymát olajon üvegesre pirítjuk."},
   {"sorszam":2,"leiras":"Fűszerpaprikát szórunk rá, majd hozzáadjuk a szeletelt paprikát."},
   {"sorszam":3,"leiras":"Egy perc múlva hozzáadjuk a paradicsomot és a szeletelt kolbászt."},
   {"sorszam":4,"leiras":"Kis lángon 20 percig főzzük, amíg besűrűsödik."}]'),

(57, 'Chilis bab',
 'Fűszeres, húsos-babos egytálétel kukoricával és paradicsommal.',
 5, 55, 9,
 '{"fo_kep":"/img/receptek/chilis-bab.jpg","galeria":[]}',
 '{"kcal":420,"feherje_g":28.0,"szenhidrat_g":40.0,"zsir_g":16.0,"rost_g":12.0}',
 '[{"sorszam":1,"leiras":"A hagymát és a fokhagymát megdinszteljük, hozzáadjuk a marhahúst."},
   {"sorszam":2,"leiras":"Fűszerpaprikát és paradicsompürét adunk hozzá."},
   {"sorszam":3,"leiras":"Hozzáadjuk a paradicsomot, a babot és a kukoricát."},
   {"sorszam":4,"leiras":"Kis lángon 30 percig főzzük."}]'),

(58, 'Zöldséges csirkés rizottó',
 'Krémes rizottó csirkemellel, zöldborsóval és sárgarépával.',
 4, 45, 9,
 '{"fo_kep":"/img/receptek/zoldseges-csirkes-rizotto.jpg","galeria":[]}',
 '{"kcal":520,"feherje_g":30.0,"szenhidrat_g":62.0,"zsir_g":14.0,"rost_g":5.0}',
 '[{"sorszam":1,"leiras":"A csirkemellet kockázzuk, és kevés olajon megsütjük."},
   {"sorszam":2,"leiras":"A hagymát, a fokhagymát és a répát vajon megpirítjuk."},
   {"sorszam":3,"leiras":"Hozzáadjuk a rizst, és forró vízzel kis adagokban felöntjük."},
   {"sorszam":4,"leiras":"A végén belekeverjük a zöldborsót és a csirkét."}]'),

(59, 'Tarhonyás hús',
 'Paprikás sertéshús pirított tarhonyával, egy lábosban.',
 4, 60, 9,
 '{"fo_kep":"/img/receptek/tarhonyas-hus.jpg","galeria":[]}',
 '{"kcal":590,"feherje_g":27.0,"szenhidrat_g":64.0,"zsir_g":24.0,"rost_g":4.0}',
 '[{"sorszam":1,"leiras":"A tarhonyát száraz serpenyőben aranybarnára pirítjuk."},
   {"sorszam":2,"leiras":"A hagymát megdinszteljük, hozzáadjuk a kockára vágott sertéskarajt, és fűszerpaprikával megszórjuk."},
   {"sorszam":3,"leiras":"Hozzáadjuk a paprikát és a paradicsomot, kevés vízzel pároljuk."},
   {"sorszam":4,"leiras":"A tarhonyát hozzáadjuk, felöntjük, és puhára főzzük."}]');

-- ---------------------------------------------------------------------
-- Recept – alapanyag összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "recept_alapanyag_osszekoto" ("alapanyag_id", "recept_id") VALUES
-- 1. Gulyásleves
(16, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), (26, 1),
-- 2. Palacsinta
(1, 2), (2, 2), (3, 2), (5, 2), (4, 2),
-- 3. Csirkepaprikás
(6, 3), (9, 3), (26, 3), (17, 3), (1, 3), (2, 3), (12, 3), (11, 3),
-- 4. Spagetti bolognai
(15, 4), (16, 4), (11, 4), (9, 4), (10, 4), (13, 4), (18, 4),
-- 5. Lencsefőzelék
(22, 5), (9, 5), (10, 5), (13, 5), (1, 5), (26, 5), (8, 5),
-- 6. Zabkása
(25, 6), (3, 6), (20, 6), (28, 6),
-- 7. Kókuszos tofu curry
(24, 7), (23, 7), (14, 7), (12, 7), (9, 7), (10, 7), (21, 7),
-- 8. Sült lazac
(27, 8), (7, 8), (13, 8), (10, 8), (30, 8),
-- 9. Almás pite
(1, 9), (4, 9), (5, 9), (2, 9), (29, 9),
-- 10. Túrós csusza
(107, 10), (55, 10), (17, 10), (34, 10),
-- 11. Spagetti carbonara
(15, 11), (34, 11), (2, 11), (53, 11),
-- 12. Penne arrabbiata
(74, 12), (49, 12), (10, 12), (13, 12), (94, 12),
-- 13. Lasagne bolognai
(75, 13), (16, 13), (49, 13), (9, 13), (4, 13), (1, 13), (3, 13), (52, 13),
-- 14. Gombás-tejszínes penne
(74, 14), (35, 14), (54, 14), (10, 14), (95, 14), (53, 14),
-- 15. Bazsalikomos-mandulás spagetti
(15, 15), (94, 15), (13, 15), (10, 15), (53, 15), (80, 15),
-- 16. Húsleves
(69, 16), (8, 16), (97, 16), (9, 16), (95, 16), (107, 16),
-- 17. Paradicsomleves
(11, 17), (49, 17), (14, 17), (5, 17), (4, 17), (94, 17),
-- 18. Gombaleves
(35, 18), (9, 18), (4, 18), (1, 18), (17, 18), (95, 18), (26, 18),
-- 19. Sütőtök krémleves
(42, 19), (9, 19), (10, 19), (54, 19), (13, 19), (92, 19),
-- 20. Hideg meggyleves
(86, 20), (5, 20), (54, 20), (60, 20),
-- 21. Korhelyleves
(41, 21), (68, 21), (34, 21), (17, 21), (9, 21), (26, 21), (1, 21),
-- 22. Rántott csirkemell
(6, 22), (1, 22), (2, 22), (106, 22), (57, 22),
-- 23. Töltött káposzta
(41, 23), (32, 23), (14, 23), (9, 23), (17, 23), (26, 23), (34, 23),
-- 24. Sertéspörkölt nokedlivel
(31, 24), (9, 24), (26, 24), (11, 24), (12, 24), (1, 24), (2, 24),
-- 25. Cigánypecsenye
(31, 25), (9, 25), (10, 25), (89, 25), (57, 25),
-- 26. Mustáros pulykamell
(70, 26), (89, 26), (54, 26), (9, 26),
-- 27. Sült csirkecomb sült zöldségekkel
(69, 27), (7, 27), (8, 27), (36, 27), (13, 27), (10, 27),
-- 28. Zöldborsófőzelék
(43, 28), (1, 28), (4, 28), (17, 28), (95, 28),
-- 29. Tökfőzelék
(36, 29), (1, 29), (17, 29), (96, 29), (90, 29), (5, 29),
-- 30. Spenótfőzelék tükörtojással
(21, 30), (1, 30), (54, 30), (10, 30), (2, 30), (4, 30),
-- 31. Zöldbabfőzelék
(44, 31), (1, 31), (17, 31), (10, 31), (90, 31),
-- 32. Burgonyafőzelék kolbásszal
(7, 32), (1, 32), (26, 32), (9, 32), (68, 32), (57, 32),
-- 33. Kelkáposzta-főzelék
(101, 33), (1, 33), (17, 33), (9, 33), (57, 33),
-- 34. Túrógombóc
(55, 34), (104, 34), (2, 34), (106, 34), (4, 34), (61, 34), (17, 34),
-- 35. Mákos tészta
(107, 35), (87, 35), (61, 35), (4, 35),
-- 36. Csokoládés brownie
(19, 36), (4, 36), (5, 36), (2, 36), (1, 36), (59, 36), (28, 36),
-- 37. Epres joghurtos pohárkrém
(82, 37), (56, 37), (58, 37), (54, 37),
-- 38. Rizsfelfújt barackkal
(14, 38), (3, 38), (2, 38), (5, 38), (4, 38), (105, 38),
-- 39. Szilvás lepény
(1, 39), (4, 39), (5, 39), (2, 39), (103, 39), (60, 39), (3, 39),
-- 40. Sonkás rántotta pirítóssal
(2, 40), (33, 40), (4, 40), (12, 40), (62, 40),
-- 41. Chia puding málnával
(81, 41), (3, 41), (83, 41), (58, 41),
-- 42. Mogyoróvajas banános pirítós
(62, 42), (79, 42), (20, 42),
-- 43. Joghurtos müzli áfonyával
(25, 43), (56, 43), (84, 43), (28, 43), (58, 43),
-- 44. Sonkás-sajtos melegszendvics
(62, 44), (33, 44), (18, 44), (4, 44),
-- 45. Rántott ponty
(64, 45), (1, 45), (2, 45), (106, 45), (57, 45), (30, 45),
-- 46. Sült pisztráng citrommal
(65, 46), (30, 46), (95, 46), (4, 46), (7, 46),
-- 47. Tőkehal paradicsomos-olívás szószban
(66, 47), (11, 47), (50, 47), (10, 47), (13, 47), (9, 47),
-- 48. Fokhagymás garnélarák vajon
(67, 48), (4, 48), (10, 48), (30, 48), (95, 48),
-- 49. Halászlé
(64, 49), (9, 49), (26, 49), (11, 49), (12, 49),
-- 50. Görög saláta
(11, 50), (46, 50), (9, 50), (50, 50), (51, 50), (13, 50), (30, 50),
-- 51. Csirkés cézársaláta
(47, 51), (6, 51), (53, 51), (62, 51), (88, 51), (30, 51),
-- 52. Tonhalsaláta
(63, 52), (47, 52), (11, 52), (45, 52), (2, 52), (13, 52),
-- 53. Céklasaláta rukkolával
(100, 53), (48, 53), (28, 53), (51, 53), (13, 53), (58, 53),
-- 54. Tejfölös uborkasaláta
(46, 54), (17, 54), (10, 54), (90, 54), (26, 54),
-- 55. Rakott krumpli
(7, 55), (2, 55), (68, 55), (17, 55), (4, 55),
-- 56. Kolbászos lecsó
(12, 56), (11, 56), (9, 56), (68, 56), (57, 56), (26, 56),
-- 57. Chilis bab
(16, 57), (77, 57), (11, 57), (49, 57), (9, 57), (10, 57), (45, 57), (26, 57),
-- 58. Zöldséges csirkés rizottó
(6, 58), (14, 58), (43, 58), (8, 58), (9, 58), (10, 58), (4, 58),
-- 59. Tarhonyás hús
(76, 59), (31, 59), (9, 59), (12, 59), (11, 59), (26, 59);

-- ---------------------------------------------------------------------
-- Fiók – allergén összerendelés
-- ---------------------------------------------------------------------
INSERT INTO "allergen_fiok_osszekoto" ("fiok_id", "allergen_id") VALUES
(2, 4),   -- Nagy Bence – mogyoró
(3, 1),   -- Szabó Eszter – glutén
(4, 3),   -- Tóth Gábor – tojás
(4, 5);   -- Tóth Gábor – diófélék

-- ---------------------------------------------------------------------
-- Hűtő (fiók tartozó alapanyagok)
-- ---------------------------------------------------------------------
INSERT INTO "huto" ("alapanyag_id", "profil_id") VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (7, 1), (9, 1),
(24, 2), (23, 2), (14, 2), (21, 2), (22, 2),
(14, 3), (6, 3), (7, 3), (11, 3), (12, 3),
(3, 4), (18, 4), (25, 4), (20, 4);

-- ---------------------------------------------------------------------
-- Mértékegységek (az átváltás az alapegységre vonatkozik)
-- ---------------------------------------------------------------------
INSERT INTO "mertekegysegek" ("id", "nev", "egysegek") VALUES
(1, 'Tömeg',
 '{"alapegyseg":"g","egysegek":[{"jel":"g","nev":"gramm","szorzo":1},{"jel":"dkg","nev":"dekagramm","szorzo":10},{"jel":"kg","nev":"kilogramm","szorzo":1000}]}'),
(2, 'Térfogat',
 '{"alapegyseg":"ml","egysegek":[{"jel":"ml","nev":"milliliter","szorzo":1},{"jel":"cl","nev":"centiliter","szorzo":10},{"jel":"dl","nev":"deciliter","szorzo":100},{"jel":"l","nev":"liter","szorzo":1000},{"jel":"tk","nev":"teáskanál","szorzo":5},{"jel":"ek","nev":"evőkanál","szorzo":15},{"jel":"bögre","nev":"bögre","szorzo":250}]}'),
(3, 'Darab',
 '{"alapegyseg":"db","egysegek":[{"jel":"db","nev":"darab","szorzo":1},{"jel":"csipet","nev":"csipet","szorzo":1},{"jel":"gerezd","nev":"gerezd","szorzo":1},{"jel":"szál","nev":"szál","szorzo":1}]}');

-- ---------------------------------------------------------------------
-- Vélemények receptekről
-- ---------------------------------------------------------------------
INSERT INTO "velemeny_receptrol" ("fiok_id", "recept_id", "velemeny") VALUES
(1, 1, 'Pont olyan, mint a nagymamámé volt! A család is imádta.'),
(1, 2, 'Nagyon könnyű elkészíteni, a gyerekek is segítettek a sütésben.'),
(2, 7, 'Fantasztikus vegán vacsora, legközelebb több currypasztát teszek bele.'),
(2, 5, 'Egyszerű, olcsó és nagyon laktató. Fokhagymával még jobb.'),
(3, 8, 'Gyors és finom, a citrom nagyon jól passzol a lazachoz.'),
(3, 3, 'Gluténmentes liszttel is remekül sikerült a galuska.'),
(4, 6, 'Tökéletes reggeli munka előtt, a dió adja meg az igazi ízét.'),
(4, 9, 'Omlós a tészta, kicsit kevesebb cukorral még jobb lenne.'),
(1, 13, 'Pont olyan, mint egy olasz étteremben! A lasagne a hétvégi kedvencünk.'),
(2, 11, 'Végre egy valódi carbonara tejszín nélkül, nagyon gyors és finom.'),
(2, 12, 'Egyszerű és tüzes, hetente egyszer biztosan elkészítem.'),
(3, 45, 'A bunda tökéletesen ropogós lett, a hal pedig szaftos maradt.'),
(3, 49, 'Igazi tiszai halászlé, csak csípősebben szeretem.'),
(3, 46, 'Gyors és könnyű vacsora, a citromos vajtól lett igazán finom.'),
(4, 43, 'Hűvös reggeleken is jólesik, az áfonya feldobja.'),
(4, 36, 'Belül puha, kívül ropogós, a dió nagyon jól passzol hozzá.'),
(1, 16, 'A klasszikus vasárnapi ebéd, mindenki repetázott.'),
(4, 34, 'A morzsa a nyerő, a gombócok szépen megfőttek.'),
(2, 19, 'A gyömbér különlegessé teszi, nagyon krémes lett.'),
(1, 56, 'Kolbásszal az igazi, a család imádja.');

-- ---------------------------------------------------------------------
-- Vélemények alapanyagokról
-- ---------------------------------------------------------------------
INSERT INTO "velemeny_alapanyagrol" ("fiok_id", "alapanyag_id", "velemeny") VALUES
(1, 26, 'A szegedi fűszerpaprika íze összehasonlíthatatlan.'),
(2, 24, 'Fűszerezve és jól kisütve szinte bármit helyettesít.'),
(2, 23, 'Zsíros, krémes állagot ad a szószoknak, érdemes a dobozosat választani.'),
(3, 14, 'Gluténmentes étkezéshez nélkülözhetetlen alapanyag.'),
(4, 28, 'Friss dióval sokkal jobb, mint a bolti, régebben tárolttal.'),
(4, 25, 'Tartós és olcsó, a reggeli alapja nálunk.');

COMMIT;