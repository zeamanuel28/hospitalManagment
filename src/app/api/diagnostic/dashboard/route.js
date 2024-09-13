import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Diagnostic from '@/backend/model/Diagnostic';
import DiagnosticResult from '@/backend/model/DiagnosticResult';

export const GET = async (request) => {
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyDiagnostic = [];
  const weeklyDiagnosticRes = [];

  for(let i=0; i<=6; i++) {
     const date = new Date(startOfWeek);
    date.setDate(date.getDate() - i);
    // Get next date
    const dateNext = new Date(date);
    dateNext.setDate(dateNext.getDate() + 1);

    // Get appointments count
    const diagnosticResult = await DiagnosticResult.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    const diagnostics = await Diagnostic.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    weeklyDiagnosticRes.push({
      date: date.toDateString(),
      count: diagnosticResult
    });

    weeklyDiagnostic.push({
      date: date.toDateString(),
      count: diagnostics
    });

  }


    const todayDiagnostic = await Diagnostic.find({createdAt: {$gte: today}});
    const totalDiagnostic = await Diagnostic.find();
    const todayDiagnosticResult = await DiagnosticResult.find({createdAt: {$gte: today}});
    const totalDiagnosticResult = await DiagnosticResult.find();

    const results ={
      todayDiagnosticCom: todayDiagnostic.filter(a => a.status === 'Completed').length,
      todayDiagnosticPen: todayDiagnostic.filter(a => a.status === 'Pending').length,

        totalDiagnosticCom: totalDiagnostic.filter(a => a.status === 'Completed').length,
        totalDiagnosticPen: totalDiagnostic.filter(a => a.status === 'Pending').length,

        todayDiagnosticResultCom: todayDiagnosticResult.length,

        totalDiagnosticResultCom: totalDiagnosticResult.length,
        
        weeklyDiagnosticRes:weeklyDiagnosticRes.reverse(),
        weeklyDiagnostic:weeklyDiagnostic.reverse(),
    }

    return new NextResponse (
      JSON.stringify ({results}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
