import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base');
    const to = searchParams.get('to');
    const amount = searchParams.get('amount');

    if (!base || !to || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: base, to, amount' },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.collectapi.com/economy/exchange?int=${amount}&to=${to}&base=${base}`;
    
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'apikey 0udzN6GhaeQOJ3pLiS7Gim:6awak8XLcTu6n8wWjb9j0D'
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response Data:', JSON.stringify(data, null, 2));

    // CollectAPI'nin gerçek yanıt formatına göre düzenleme
    if (data.success && data.result && data.result.data && data.result.data.length > 0) {
      const currencyData = data.result.data[0];
      
      const convertedData = {
        success: true,
        result: {
          base: base.toUpperCase(),
          to: to.toUpperCase(),
          amount: parseFloat(amount),
          convertedAmount: currencyData.calculated || parseFloat(currencyData.calculatedstr) || 0,
          rate: parseFloat(currencyData.rate) || 0
        }
      };

      console.log('Converted Data:', JSON.stringify(convertedData, null, 2));
      return NextResponse.json(convertedData);
    } else {
      console.error('Invalid API response structure:', data);
      return NextResponse.json(
        { error: 'Invalid response from currency API', apiResponse: data },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Currency conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert currency', details: error.message },
      { status: 500 }
    );
  }
} 