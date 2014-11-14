<%
set conn=Server.CreateObject("ADODB.Connection")
conn.Provider="Microsoft.Jet.OLEDB.4.0"
conn.Open("C:\Documents and Settings\All Users\Documents\DBTryTest.mdb")
set rs = Server.CreateObject("ADODB.recordset")
sql = "SELECT * FROM t_countries"
%>
<html dir='rtl'>
<head>
	<META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=windows-1255">
	<title>טופס הרשמה</title>
	<link href='Design.css' rel='stylesheet'>
	<script language='javascript'>
	function firstField()
	{
	 if (frmSignTo.txtID.value != "")
	 {
		frmSignTo.txtFirst.focus();
	 }
	 else
	 {
		frmSignTo.txtID.focus();
	 }
	}
	</script>
</head>
<body onload='firstField()'>
<h2 align='center'>רשום לקוח חדש</h2>
	<form name='frmSignTo' action='Sign.asp' method='post'>
	<table align='center'>
		<tr>
			<td width=100>
				 מספר ת.ז:
			</td>
			<td>
				<input type='text' name='txtID' value='<%=session("id") %>'>
			</td>
		</tr>
		<tr>
			<td width=100>
				 מספר ת.ז נוסף:
			</td>
			<td>
				<input type='text' name='txtID2' value='<%=session("Id2") %>'>
			</td>
		</tr>		
		<tr>
			<td width=120>
				שם פרטי:
			</td>
			<td>
				<input type='text' name='txtFirst' value='<%=session("name") %>'>
			</td>
		</tr>
		<tr>
			<td width=120>
				שם משפחה:
			</td>
			<td>
				<input type='text' name='txtLast'>
			</td>
		</tr>	
		<tr>
			<td width=120>
				תאריך לידה:
			</td>
			<td>
				<select name='sltYear'>
				<script>
				for (var i=2007; i>=1907; i--)
                                document.write("<option value='"+i+"'>"+i)
				</script>
				</select>
				<select name='sltMonth'>
				<script>
				for (var i=1; i<=12; i++)
                                document.write("<option value='"+i+"'>"+i)
				</script>
				</select>
				<select name='sltDay'>
				<script>
				for (var i=1; i<=31; i++)
                                document.write("<option value='"+i+"'>"+i)
				</script>
				</select>
			</td>
		</tr>
		<tr>
			<td width=100>
				ארץ:
			</td>
			<td>
				<table>
				<tr>
				<td>
				<select name="sltCountry" style="width:226">
				<% rs.Open sql, conn 
				   do until rs.EOF%>
				<script language="javascript">
                                var strCountry = "<%=rs.Fields("CountryName") %>".toUpperCase();
                                var strSlcCountry = "<%=session("country") %>";
				if (strCountry == strSlcCountry)
				{
                                 document.write("<option value='"+strCountry+"' selected>"+strCountry);
				}
				else
				{
                                 document.write("<option value='"+strCountry+"'>"+strCountry);
				}
				</script>
				<%rs.MoveNext
				loop
				rs.close
				conn.close %>
				</select>
				</td>
				</tr>
				<tr>
				<td>
				<input type="text" name="txtAddress" id="txtAddress">
				</td>
				</tr>
				</table>
			</td>
		</tr>
		<tr>
		<tr>
			<td width=120>
				מספר טלפון:
			</td>
			<td>
				<input type='text' name='txtPhone' value='<%=session("phone") %>'>
			</td>
		</tr>
		<tr>
			<td width=120>
				טלפון #2:
			</td>
			<td>
				<input type='text' name='txtPhone2'>
			</td>
		</tr>
		<tr>
			<td width=120>
				טלפון #3:
			</td>
			<td>
				<input type='text' name='txtPhone3'>
			</td>
		</tr>	
		<!-- Request 26.11.11 - Add Passport Indication -->
		<tr>
			<td width=120>
				דרכון נבדק:
			</td>
			<td>
				<input type='checkbox' name='cbPassport' value=false></input>
			</td>
		</tr>
		<!-- End of request -->	
		<tr>
			<td width=120>
				הערות:
			</td>
			<td>
				<textarea name='txtNotes'></textarea>
			</td>
		</tr>

		<tr height=60 valign='middle'>
			<td colspan=2 align='center'>
				<input type='submit' class="button" value="רשום לקוח">
			</td>
		</tr>
	</table>	
	</form>
</body>
</html>
<%
session("id")=""
session("name")=""
session("country")=""
session("phone")=""
%>			