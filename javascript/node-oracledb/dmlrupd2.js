/* Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   dmlrupd2.js
 *
 * DESCRIPTION
 *   Example of 'DML Returning' with multiple rows matched.
 *   The ROWIDs of the changed records are returned.  This is how to get
 *   the 'last insert id'.
 *   Bind names cannot be reused in the DML section and the RETURNING section.
 *
 *   Use demo.sql to create the required table or do:
 *     DROP TABLE dmlrupdtab;
 *     CREATE TABLE dmlrupdtab (id NUMBER, name VARCHAR2(40));
 *     INSERT INTO dmlrupdtab VALUES (1001, 'Venkat');
 *     INSERT INTO dmlrupdtab VALUES (1002, 'Neeharika');
 *     COMMIT;
 *
 *****************************************************************************/

var oracledb = require( 'oracledb' );
var dbConfig = require('./dbconfig.js');

oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection)
  {
    if (err)
    {
      console.error(err);
      return;
    }

    connection.execute(
      "UPDATE dmlrupdtab SET name = :name WHERE id IN (:id1, :id2) RETURNING id, ROWID INTO :ids, :rids",
      {
        id1:   1001,
        id2:   1002,
        name:  "Chris",
        ids:   { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        rids:  { type: oracledb.STRING, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true },
      function(err, result)
      {
        if (err)
        {
          console.error(err);
          return;
        }
        console.log(result.outBinds);
      });
  });
