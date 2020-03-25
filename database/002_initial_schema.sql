

-- Extension

CREATE EXTENSION citext;

-- Domain 
CREATE DOMAIN email AS citext
  CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

-- ENUMS

CREATE TYPE status AS ENUM ('0', '1', '2');
-- CONFIG
REVOKE CONNECT ON DATABASE booking_dev FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Tables

-- Company

CREATE TABLE
IF NOT EXISTS public.company(
    CID SERIAL PRIMARY KEY,
    email citext UNIQUE NOT NULL,
    orgNum bigint UNIQUE NOT NULL,
    username text UNIQUE NOT NULL ,
    salt text NOT NULL ,
    passhash varchar NOT NULL ,
    name text  NOT NULL
);

-- Company User
CREATE TABLE
IF NOT EXISTS public.companyuser(
    CUID SERIAL PRIMARY KEY,
    email citext UNIQUE,
    telephone text NOT NULL,
    username text NOT NULL,
    salt text NOT NULL,
    passhash varchar NOT NULL ,
    givenname text  NOT NULL,
    surename text  NOT NULL,
    CID INTEGER REFERENCES company(CID) NOT NULL
);

--OWUser
CREATE TABLE
IF NOT EXISTS public.onlineuser(
    OID SERIAL PRIMARY KEY,
    JWT varchar NOT NULL,
    companies int[]
);

--Event
CREATE TABLE
IF NOT EXISTS public.event(
    EID SERIAL PRIMARY KEY,
    statusCode status NOT NULL
    );

--Offer
CREATE TABLE
IF NOT EXISTS public.offer(
    OFID SERIAL PRIMARY KEY,
    statusCode status NOT NULL,
    data jsonb NOT NULL,
    EID INTEGER REFERENCES event(EID) NOT NULL,
    CID INTEGER REFERENCES company(CID) NOT NULL,
    OID INTEGER REFERENCES onlineuser(OID) NOT NULL
);

--Wish
CREATE TABLE
IF NOT EXISTS public.wish(
    WID SERIAL PRIMARY KEY,
    statusCode status NOT NULL,
    data JSONB NOT NULL,
    EID INTEGER REFERENCES event(EID) NOT NULL,
    CUID INTEGER REFERENCES companyuser(CUID),
    CID INTEGER REFERENCES company(CID) NOT NULL
);
--Contracts
CREATE TABLE
IF NOT EXISTS public.contracts(
    contractID SERIAL PRIMARY KEY,
    acceptDate bigint NOT NULL,
    expirationDate bigint NOT NULL,
    price bigint NOT NULL,
    billingAdresse text NOT NULL,
    statusCode status NOT NULL,
    path text NOT NULL,
    orgNum bigint REFERENCES company(orgNum) NOT NULL,
    EID INTEGER REFERENCES event(EID) NOT NULL,
    CUID INTEGER REFERENCES companyuser(CUID),
    CID INTEGER REFERENCES company(CID) NOT NULL,
    OID INTEGER REFERENCES onlineuser(OID) NOT NULL
);
--Ads
CREATE TABLE
IF NOT EXISTS ad(
    CID INTEGER REFERENCES company(CID) NOT NULL
    ) INHERITS (event)
;
-- Queue
CREATE TABLE
IF NOT EXISTS public.queue(
    QID SERIAL PRIMARY KEY,
    priority SERIAL,
    statusCode INTEGER NOT NULL,
    CID INTEGER REFERENCES company(CID) NOT NULL,
    EID INTEGER REFERENCES event(EID) NOT NULL
);
-- Signatures
CREATE TABLE
IF NOT EXISTS public.signatures(
    SID SERIAL PRIMARY KEY,
    path text,
    OID INTEGER REFERENCES onlineuser(OID) NOT NULL
);


--bookingevent
CREATE TABLE
IF NOT EXISTS bookingevent(
    data jsonb NOT NULL
    ) INHERITS (event)
;

--itex
CREATE TABLE
IF NOT EXISTS itex(
    data jsonb NOT NULL
    ) INHERITS (event)
;


--Enable row security

DO $$
DECLARE
    tables CURSOR FOR
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename;
    nbRow int;
BEGIN
    FOR table_record IN tables LOOP
            EXECUTE 'ALTER TABLE ' || table_record.tablename || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END$$;


-- Views 


--Functions

CREATE FUNCTION get_CID_companyUser(luser text) RETURNS INTEGER AS $$
    SELECT CID
    FROM companyuser
    WHERE username = luser
    $$ LANGUAGE SQL STRICT STABLE SECURITY DEFINER;
CREATE FUNCTION get_CUID_companyUser(luser text) RETURNS INTEGER AS $$
    SELECT CUID
    FROM companyuser
    WHERE username = luser
    $$ LANGUAGE SQL STRICT STABLE SECURITY DEFINER;
-- Groups 

CREATE GROUP companyUsers WITH NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT;
CREATE GROUP onlineUsers WITH NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT;


-- companyUser_policy
CREATE POLICY companyUser_select_policy
    ON companyuser
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
;
CREATE POLICY companyUser_update_policy
    ON companyuser
    FOR UPDATE
    USING (username = current_user)
    WITH CHECK (username = current_user)
;
CREATE POLICY companyUser_insert_policy
    ON companyuser
    FOR INSERT
    WITH CHECK(CID = get_CID_companyUser(current_user))
;
CREATE POLICY companyUser_ow_policy
    ON companyuser
    FOR All
    TO onlineUsers
    USING (TRUE)
    WITH CHECK(TRUE)
;
-- company_policy
CREATE POLICY company_select_policy
    ON company
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
;

CREATE POLICY company_ow_policy
    ON company
    FOR All
    TO onlineUsers
    USING (TRUE)
    WITH CHECK(TRUE)
;
--Event
CREATE POLICY event_ow_policy
    ON event
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;
-- offer_policy
CREATE POLICY offer_select_policy
    ON offer
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
;
CREATE POLICY offer_update_policy
    ON offer
    FOR UPDATE
    USING (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
    WITH CHECK (statusCode in ('1', '2'))
;
CREATE POLICY offer_ow_policy
    ON offer
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK(TRUE)
;
-- wish_policy
CREATE POLICY wish_select_policy
    ON wish
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
;
CREATE POLICY wish_insert_policy
    ON wish
    FOR INSERT
    WITH CHECK (CID = get_CID_companyUser(current_user) and CUID = get_CUID_companyUser(current_user))
;
CREATE POLICY wish_update_policy
    ON wish
    FOR UPDATE
    USING (CUID = get_CUID_companyUser(current_user) )
    WITH CHECK (CID = get_CID_companyUser(current_user) and CUID = get_CUID_companyUser(current_user))
;
CREATE POLICY wish_ow_policy
    ON wish
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;
--Ads 
CREATE POLICY ad_insert_policy
    ON ad
    FOR INSERT
    WITH CHECK (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
;
CREATE POLICY ad_update_policy
    ON ad
    FOR UPDATE
    USING (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
    WITH CHECK (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
;
CREATE POLICY ad_select_policy
    ON ad
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user) )
;
CREATE POLICY ad_ow_policy
    ON ad
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;
--bookingevent
CREATE POLICY bookingevent_update_policy
    ON bookingevent
    FOR UPDATE
    USING (statusCode in ('1', '2'))
    WITH CHECK (statusCode in ('1', '2'))
;
CREATE POLICY bookingevent_select_policy
    ON bookingevent
    FOR SELECT
    USING (statusCode in ('1', '2'))
;
CREATE POLICY bookingevent_ow_policy
    ON bookingevent
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;
--itex
CREATE POLICY itex_update_policy
    ON itex
    FOR UPDATE
    USING (statusCode in ('1', '2'))
    WITH CHECK (statusCode in ('1', '2'))
;
CREATE POLICY itex_select_policy
    ON itex
    FOR SELECT
    USING (statusCode in ('1', '2'))
;
CREATE POLICY itex_ow_policy
    ON itex
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;
--Contracts

CREATE POLICY contracts_update_policy
    ON contracts
    FOR UPDATE
    USING (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
    WITH CHECK (statusCode in ('1', '2'))
;
CREATE POLICY contracts_select_policy
    ON contracts
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user) )
;
CREATE POLICY contracts_ow_policy
    ON contracts
    FOR ALL
    TO onlineUsers
    USING(TRUE)
    WITH CHECK(TRUE)
;
-- Queue

CREATE POLICY queue_insert_policy
    ON queue
    FOR INSERT
    WITH CHECK (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
;
CREATE POLICY queue_select_policy
    ON queue
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user) )
;
CREATE POLICY queue_ow_policy
    ON queue
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;

-- Signatures

CREATE POLICY signatures_ow_policy
    ON signatures
    FOR ALL
    TO onlineUsers
    USING (TRUE)
    WITH CHECK (TRUE)
;

-- Policies for views

--Grant | Saying which columns you can access

--- config
GRANT CONNECT ON DATABASE booking_dev TO companyUsers,onlineUsers;


-- company
--PS NO Insert on company and companyUsers because they will always added with a role by the admins. -.-' 
GRANT SELECT (CID,email,username, name,orgNum) ON TABLE company TO companyUsers,onlineUsers;
GRANT DELETE ON TABLE company TO onlineUsers;
GRANT INSERT ON TABLE company TO onlineUsers;
GRANT UPDATE (email,username,passhash) ON TABLE company TO companyUsers;
GRANT USAGE, SELECT ON SEQUENCE company_cid_seq TO companyUsers;

--companyUsers
GRANT SELECT (CUID,email,telephone,username,givenname, surename,CID) ON companyUser TO companyUsers,onlineUsers;
GRANT UPDATE ON TABLE companyUser TO companyUsers;
GRANT USAGE, SELECT ON SEQUENCE companyuser_cuid_seq TO companyUsers;

--Event
GRANT SELECT ON TABLE event TO onlineUsers;
GRANT INSERT(statusCode) ON TABLE event TO onlineUsers;
GRANT UPDATE(statusCode) ON TABLE event TO onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE event_eid_seq TO companyUsers,onlineUsers;


-- Offer
GRANT SELECT (EID,OID,statusCode,data) ON TABLE offer TO companyUsers,onlineUsers;
GRANT DELETE ON TABLE offer TO onlineUsers;
GRANT UPDATE (statusCode,data) ON TABLE offer TO companyUsers,onlineUsers;
GRANT INSERT (EID,CID,OID,statusCode,data) ON TABLE offer TO onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE offer_ofid_seq TO onlineUsers;

-- Wish
GRANT SELECT ON TABLE wish TO companyUsers,onlineUsers;
GRANT UPDATE (statusCode,data) ON TABLE wish TO companyUsers,onlineUsers;
GRANT INSERT (EID,CID,CUID,statusCode,data) ON TABLE wish TO companyUsers,onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE wish_wid_seq TO companyUsers;

--Ads
GRANT SELECT ON TABLE ad TO companyUsers,onlineUsers;
GRANT INSERT ON TABLE ad TO companyUsers,onlineUsers;
GRANT UPDATE(statusCode) ON TABLE ad TO companyUsers,onlineUsers;

--bookingevent
GRANT SELECT ON TABLE bookingevent TO companyUsers,onlineUsers;
GRANT INSERT ON TABLE bookingevent TO onlineUsers;
GRANT UPDATE(data) ON TABLE bookingevent TO companyUsers;
GRANT UPDATE(statusCode,data) ON TABLE bookingevent TO onlineUsers;

--itex
GRANT SELECT ON TABLE itex TO companyUsers,onlineUsers;
GRANT INSERT ON TABLE itex TO onlineUsers;
GRANT UPDATE(data) ON TABLE bookingevent TO companyUsers;
GRANT UPDATE(statusCode,data) ON TABLE bookingevent TO onlineUsers;

--Contracts
GRANT SELECT ON TABLE contracts TO companyUsers,onlineUsers;
GRANT INSERT ON TABLE contracts TO onlineUsers;
GRANT UPDATE(price,statusCode,expirationDate,acceptDate) ON TABLE contracts TO companyUsers,onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE contracts_contractid_seq TO onlineUsers;


-- Queue
GRANT SELECT ON TABLE queue TO companyUsers,onlineUsers;
GRANT INSERT(statusCode,CID,EID) ON TABLE queue TO companyUsers,onlineUsers;
GRANT UPDATE(statusCode) ON TABLE queue TO onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE queue_qid_seq TO companyUsers,onlineUsers;

-- Signatures
GRANT SELECT ON TABLE signatures to onlineUsers;
GRANT INSERT ON TABLE signatures to onlineUsers;
GRANT UPDATE ON TABLE signatures to onlineUsers;
GRANT USAGE, SELECT ON SEQUENCE signatures_sid_seq TO onlineUsers;

