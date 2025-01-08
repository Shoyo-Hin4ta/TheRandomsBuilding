import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Download } from 'lucide-react';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { toast } from 'sonner';

const GenerateReport = () => {
  const [timeFrame, setTimeFrame] = useState('1week');
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const accessToken = useSelector(state => state.user.accessToken);

  const diseaseOptions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'cholesterol', label: 'High Cholesterol' },
    { id: 'celiac', label: 'Celiac Disease' },
    { id: 'lactose', label: 'Lactose Intolerance' }
  ];

  const timeFrameOptions = [
    { value: '1week', label: 'Last Week' },
    { value: '2weeks', label: 'Last 2 Weeks' },
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' }
  ];

  const generatePDF = async (reportData) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      let yOffset = 800;
      
      // Header
      page.drawText('NutriTrack', {
        x: 50,
        y: yOffset,
        size: 28,
        font: helveticaBold,
        color: rgb(5/255, 150/255, 105/255), // emerald-600
      });
      yOffset -= 30;

      // User Info
      page.drawText(`Report for: ${currentUser.username}`, {
        x: 50,
        y: yOffset,
        size: 14,
        font: helvetica,
      });
      yOffset -= 40;

      // Date Range
      const startDate = new Date(reportData.timeRange.start).toLocaleDateString();
      const endDate = new Date(reportData.timeRange.end).toLocaleDateString();
      
      page.drawText('Report Period:', {
        x: 50,
        y: yOffset,
        size: 16,
        font: helveticaBold,
        color: rgb(13/255, 148/255, 136/255), // teal-600
      });
      yOffset -= 25;

      page.drawText(`${startDate} to ${endDate}`, {
        x: 50,
        y: yOffset,
        size: 12,
        font: helvetica,
      });
      yOffset -= 40;

      // Nutritional Summary
      page.drawText('Nutritional Summary', {
        x: 50,
        y: yOffset,
        size: 18,
        font: helveticaBold,
      });
      yOffset -= 30;

      const { nutritionalSummary } = reportData;
      const dailyAvg = nutritionalSummary.dailyAverages;

      // Daily Averages
      page.drawText('Daily Averages:', {
        x: 70,
        y: yOffset,
        size: 14,
        font: helveticaBold,
      });
      yOffset -= 25;

      const nutritionMetrics = [
        { label: 'Calories', value: dailyAvg.calories.toFixed(1) },
        { label: 'Protein', value: `${dailyAvg.protein.toFixed(1)}g` },
        { label: 'Carbohydrates', value: `${dailyAvg.carbs.toFixed(1)}g` },
        { label: 'Fat', value: `${dailyAvg.fat.toFixed(1)}g` }
      ];

      nutritionMetrics.forEach(metric => {
        page.drawText(`${metric.label}: ${metric.value}`, {
          x: 90,
          y: yOffset,
          size: 12,
          font: helvetica,
        });
        yOffset -= 20;
      });
      yOffset -= 20;

      // Analysis
      if (reportData.analysis) {
        page.drawText('Analysis & Recommendations', {
          x: 50,
          y: yOffset,
          size: 18,
          font: helveticaBold,
        });
        yOffset -= 30;

        // Summary
        const summaryLines = reportData.analysis.summary
          .match(/.{1,80}(?:\s|$)/g) || [];
        
        summaryLines.forEach(line => {
          page.drawText(line.trim(), {
            x: 70,
            y: yOffset,
            size: 12,
            font: helvetica,
          });
          yOffset -= 20;
        });
        yOffset -= 20;

        // Recommendations
        if (reportData.analysis.recommendations.length > 0) {
          page.drawText('Key Recommendations:', {
            x: 70,
            y: yOffset,
            size: 14,
            font: helveticaBold,
          });
          yOffset -= 25;

          reportData.analysis.recommendations.forEach(rec => {
            const recLines = rec.match(/.{1,75}(?:\s|$)/g) || [];
            recLines.forEach(line => {
              page.drawText(`• ${line.trim()}`, {
                x: 90,
                y: yOffset,
                size: 12,
                font: helvetica,
              });
              yOffset -= 20;
            });
            yOffset -= 5;
          });
        }

        // Disease-specific advice
        if (diseases.length > 0 && reportData.analysis.diseaseSpecificAdvice) {
          yOffset -= 20;
          page.drawText('Health Condition Specific Advice:', {
            x: 70,
            y: yOffset,
            size: 14,
            font: helveticaBold,
          });
          yOffset -= 25;

          Object.entries(reportData.analysis.diseaseSpecificAdvice).forEach(([disease, advice]) => {
            page.drawText(diseaseOptions.find(d => d.id === disease)?.label || disease, {
              x: 90,
              y: yOffset,
              size: 12,
              font: helveticaBold,
            });
            yOffset -= 20;

            const adviceLines = advice.match(/.{1,70}(?:\s|$)/g) || [];
            adviceLines.forEach(line => {
              page.drawText(line.trim(), {
                x: 110,
                y: yOffset,
                size: 12,
                font: helvetica,
              });
              yOffset -= 20;
            });
            yOffset -= 10;
          });
        }
      }

      return await pdfDoc.save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/report`,
        {
          diseases,
          timeFrame
        },
        {  
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        const pdfBytes = await generatePDF(response.data.data);
        
        // Create blob and download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `nutritrack-report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        toast.success('Report generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Nutrition Report Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Get a comprehensive analysis of your nutritional habits
        </p>
      </div>

      <Card className="border-emerald-100 shadow-lg">
        <CardHeader className="border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Generate Your Report
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Select your preferences to generate a personalized nutrition report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-emerald-800">Time Frame</Label>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-emerald-800">Health Considerations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-lg">
              {diseaseOptions.map((disease) => (
                <div key={disease.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={disease.id}
                    checked={diseases.includes(disease.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setDiseases([...diseases, disease.id]);
                      } else {
                        setDiseases(diseases.filter(d => d !== disease.id));
                      }
                    }}
                    className="border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                  />
                  <Label htmlFor={disease.id} className="text-emerald-800">
                    {disease.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Generating Report...
              </div>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>

          {loading && (
            <div className="text-center text-sm text-emerald-600">
              Please wait while we analyze your nutrition data...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateReport;