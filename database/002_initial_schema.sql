

-- Extension

CREATE EXTENSION citext;

-- Domain 
CREATE DOMAIN email AS citext
  CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

-- ENUMS

CREATE TYPE status AS ENUM ('0', '1', '2');
-- CONFIG
-- REVOKE CONNECT ON DATABASE  (SELECT CURRENT_CATALOG) FROM PUBLIC;
-- TODO ReAdd the revoke in HBA Config
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- Tables

-- Company

CREATE TABLE
IF NOT EXISTS public.company(
    CID SERIAL PRIMARY KEY,
    email citext UNIQUE NOT NULL,
    orgNum bigint UNIQUE NOT NULL,
    name text  NOT NULL
);

-- Company User
CREATE TABLE
IF NOT EXISTS public.companyuser(
    CUID SERIAL PRIMARY KEY,
    email citext UNIQUE,
    telephone text,
    username text UNIQUE NOT NULL,
    passhash varchar NOT NULL ,
    givenname text  NOT NULL,
    surename text  NOT NULL,
    CID INTEGER REFERENCES company(CID) NOT NULL
);

--OWUser
CREATE TABLE
IF NOT EXISTS public.onlineuser(
    OID INTEGER PRIMARY KEY,
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

-- company_policy
CREATE POLICY company_select_policy
    ON company
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
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
-- wish_policy
CREATE POLICY wish_select_policy
    ON wish
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
;
CREATE POLICY wish_insert_policy
    ON wish
    FOR INSERT
    WITH CHECK ((CID = get_CID_companyUser(current_user) and CUID = get_CUID_companyUser(current_user)))
;
CREATE POLICY wish_update_policy
    ON wish
    FOR UPDATE
    USING (CUID = get_CUID_companyUser(current_user))
    WITH CHECK (CID = get_CID_companyUser(current_user) and CUID = get_CUID_companyUser(current_user))
;

--Ads 
CREATE POLICY ad_insert_policy
    ON ad
    FOR INSERT
    WITH CHECK ((CID = get_CID_companyUser(current_user)) and statusCode in ('1', '2'))
;
CREATE POLICY ad_update_policy
    ON ad
    FOR UPDATE
    USING (CID = get_CID_companyUser(current_user) and statusCode in ('1', '2'))
    WITH CHECK ((CID = get_CID_companyUser(current_user)) and statusCode in ('1', '2'))
;
CREATE POLICY ad_select_policy
    ON ad
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
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

--Contracts

CREATE POLICY contracts_update_policy
    ON contracts
    FOR UPDATE
    USING ((CID = get_CID_companyUser(current_user)) and statusCode in ('1', '2'))
    WITH CHECK (statusCode in ('1', '2'))
;
CREATE POLICY contracts_select_policy
    ON contracts
    FOR SELECT
    USING (CID = get_CID_companyUser(current_user))
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
    USING (CID = get_CID_companyUser(current_user))
;


-- Policies for views

--Grant | Saying which columns you can access

--- config
GRANT CONNECT ON DATABASE booking_dev TO companyUsers;


-- company
--PS NO Insert on company and companyUsers because they will always added with a role by the admins. -.-' 
GRANT SELECT (CID,email,name,orgNum) ON TABLE company TO companyUsers;

--companyUsers
GRANT SELECT (CUID,email,telephone,username,givenname, surename,CID) ON companyUser TO companyUsers;
GRANT UPDATE ON TABLE companyUser TO companyUsers;

--Event
GRANT USAGE, SELECT ON SEQUENCE event_eid_seq TO companyUsers;


-- Offer
GRANT SELECT (EID,OID,statusCode,data) ON TABLE offer TO companyUsers;
GRANT UPDATE (statusCode,data) ON TABLE offer TO companyUsers;

-- Wish
GRANT SELECT ON TABLE wish TO companyUsers;
GRANT UPDATE (statusCode,data) ON TABLE wish TO companyUsers;
GRANT INSERT (EID,CID,CUID,statusCode,data) ON TABLE wish TO companyUsers;
GRANT USAGE, SELECT ON SEQUENCE wish_wid_seq TO companyUsers;

--Ads
GRANT SELECT ON TABLE ad TO companyUsers;
GRANT INSERT ON TABLE ad TO companyUsers;
GRANT UPDATE(statusCode) ON TABLE ad TO companyUsers;

--bookingevent
GRANT SELECT ON TABLE bookingevent TO companyUsers;
GRANT UPDATE(data) ON TABLE bookingevent TO companyUsers;

--itex
GRANT SELECT ON TABLE itex TO companyUsers;
GRANT UPDATE(data) ON TABLE bookingevent TO companyUsers;

--Contracts
GRANT SELECT ON TABLE contracts TO companyUsers;
GRANT UPDATE(price,statusCode,expirationDate,acceptDate) ON TABLE contracts TO companyUsers;


-- Queue
GRANT SELECT ON TABLE queue TO companyUsers;
GRANT INSERT(statusCode,CID,EID) ON TABLE queue TO companyUsers;
GRANT USAGE, SELECT ON SEQUENCE queue_qid_seq TO companyUsers;


