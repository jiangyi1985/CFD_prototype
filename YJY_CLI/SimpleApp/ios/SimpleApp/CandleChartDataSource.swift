//
//  CandleChartDataSource.swift
//  TH_CFD
//
//  Created by william on 16/9/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//

protocol CandleChartDataProvider: BaseDataProvider
{
	func candleRenderData() -> [CandlePositionData]
	func xVerticalLines() -> [CGFloat]
	func timeVerticalLines() -> [Date]
	func oneCandleWidth() -> CGFloat
}

class CandleData: BaseData {
	var open: Double = 0
	var close: Double = 0
	var high: Double = 0
	var low: Double = 0
	
	override init(dict:NSDictionary) {
		super.init(dict: dict)
		open = (dict["open"] as? Double)!
		close = (dict["close"] as? Double)!
		high = (dict["high"] as? Double)!
		low = (dict["low"] as? Double)!
	}
}

class CandlePositionData: NSObject {
	var open: CGFloat = 0
	var close: CGFloat = 0
	var high: CGFloat = 0
	var low: CGFloat = 0
	var x: CGFloat = 0
	
	init(open:CGFloat, close:CGFloat, high:CGFloat, low:CGFloat, x:CGFloat) {
		super.init()
		self.open = open
		self.close = close
		self.high = high
		self.low = low
		self.x = x
	}
}

class CandleChartDataSource: BaseDataSource, CandleChartDataProvider {
	var _candleData = [CandleData]()
	var stockData:StockData?
	
	let candleWidth:CGFloat = 5.0
	let spacer:CGFloat = 8.0
	
	var _candlePositionData:[CandlePositionData] = []
	var verticalLinesX:[CGFloat] = []
	var verticalLinesTime:[Date] = []
	
	var currentPanX:CGFloat = 0
	var lastPanX:CGFloat = 0
	
	var currentScale:CGFloat = 1
	var lastScale:CGFloat = 1
	let MIN_SCALE:CGFloat = 0.5
	let MAX_SCALE:CGFloat = 3
	
	override func parseJson() {
		// demo:{\"lastOpen\":\"2016-03-24T13:31:00Z\",\"preClose\":100.81,\"longPct\":0.415537619225466,\"id\":14993,\"symbol\":\"CVS UN\",\"name\":\"CVS\",\"open\":0,\"last\":101.48,\"isOpen\":false,\"priceData\":[{\"p\":100.56,\"time\":\"2016-03-24T13:30:00Z\"},{\"p\":100.84,\"time\":\"2016-03-24T13:31:00Z\"}]}
		let nsData: Data = _jsonString.data(using: String.Encoding.utf8)!
		_candleData = []
		do {
			let json: Any? = try JSONSerialization.jsonObject(with: nsData, options: JSONSerialization.ReadingOptions.mutableLeaves)
//			print(json)
			if let jsonDict = json as? NSDictionary {
				if _jsonString.range(of: "priceData") != nil {
					let jsonArray = jsonDict["priceData"] as! NSArray
					for chartDict in jsonArray {
						let data:CandleData = CandleData.init(dict: chartDict as! NSDictionary)
						_candleData.append(data)
					}
					_candleData = _candleData.reversed()
//                    unitTest()
				}
				if _jsonString.range(of: "preClose") != nil {
					self.stockData = StockData()
					self.stockData?.initWithDictionay(jsonDict)
				}
			}
		}
		catch {
			print("error serializing JSON: \(error)")
		}
	}
	
	override func setChartType(_ newValue:String) {
		if ["day", "1m", "5m", "15m", "60m"].contains(newValue) {
			super.setChartType(newValue)
		}
	}
	
	static func isValidData(_ json:String) -> Bool {
		return json.contains("open") && json.contains("close") && json.contains("high") && json.contains("low")
	}
	
	override func isEmpty() -> Bool {
		return _candleData.isEmpty
	}
	
	override func calculateData(_ rect:CGRect) {
		if _chartType == "undefined" {
			return
		}
        _rect = rect
		if (_rect == CGRect.zero || _candleData.isEmpty) {
			return
        }
        let width = chartWidth()
        let height = chartHeight()
		
		let needRender = { (column: Int) -> Bool in
			let x:CGFloat = width - CGFloat(column) * self.oneSpacer() - self._margin + self.panX()
			return x > self._margin && x < width - self._margin + self.oneSpacer()
		}
		var maxValue:Double = 0
		var minValue:Double = 10000000
		for i in 0 ..< _candleData.count {
			if needRender(i) {
				let data:CandleData = _candleData[i]
				if (maxValue < data.high) {
					maxValue = data.high
				}
				if (minValue > data.low) {
					minValue = data.low
				}
			}
		}
		
		//calculate the x point
        let topBorder:CGFloat = AppDelegate.isPortrait() ? height * 0.12 : 2
        let bottomBorder:CGFloat = AppDelegate.isPortrait() ? height * 0.15 : 2
		let graphHeight:CGFloat = height - topBorder - bottomBorder
		
		let columnPosition = { (column:Int) -> CandlePositionData in
			let candle:CandleData = self._candleData[column]
			let x:CGFloat = width - CGFloat(column) * self.oneSpacer() - self._margin - self.oneSpacer()/2 + self.panX()
			let y:CGFloat = height/2
			var high:CGFloat=y,low:CGFloat=y,open:CGFloat=y,close:CGFloat=y
			if (maxValue > minValue) {
				high = graphHeight + topBorder - CGFloat((candle.high-minValue) / (maxValue - minValue)) * graphHeight
				low = graphHeight + topBorder - CGFloat((candle.low-minValue) / (maxValue - minValue)) * graphHeight
				open = graphHeight + topBorder - CGFloat((candle.open-minValue) / (maxValue - minValue)) * graphHeight
				close = graphHeight + topBorder - CGFloat((candle.close-minValue) / (maxValue - minValue)) * graphHeight
			}
			return CandlePositionData.init(open: round(open), close: round(close), high: round(high), low: round(low), x: x)
		}
		
		_candlePositionData = []
		
		for i in 0..<_candleData.count {
			let position:CandlePositionData = columnPosition(i)
			_candlePositionData.append(position)
		}
		
		self.calculateVerticalLines()
		
		_maxValue = maxValue
		_minValue = minValue
		_preCloseValue = self.stockData?.preClose
	}
	
	func calculateVerticalLines() -> Void {
		
		let gaps = ["5m":3600.0, "day":3600.0*24*14, "1m":900.0, "15m":3600.0*3, "60m":3600.0*12,]
		let gap = gaps[_chartType]!		// gap between two lines
		
		if let time0 = _candleData.first?.time {
			var endTime = time0
			verticalLinesX = []
			verticalLinesTime = []
			for i in 0 ..< _candleData.count {
				if let time = _candleData[i].time {
					let interval:TimeInterval = -time.timeIntervalSince(endTime)
					if interval > gap*0.99 {
						verticalLinesX.append(_candlePositionData[i].x)
						endTime = time
						verticalLinesTime.append(self._candleData[i].time! as Date)
					}
				}
			}
		}
	}
	
	override func panTranslation(_ translation: CGPoint, isEnd:Bool = false) {
		currentPanX = translation.x	//pan right means go earlier
		
		if (isEnd) {
			lastPanX = panX()
			if lastPanX < 1 {
				lastPanX = 0
			}
			currentPanX = 0
		}
	}
	
	func maxPanX() -> CGFloat {
		if (isEmpty()) {
			return 0
		}
		else {
			let allCandleWidth = CGFloat(_candleData.count) * oneSpacer()
			let viewWidth = chartWidth() - _margin * 2
			if allCandleWidth > viewWidth {
				return allCandleWidth - viewWidth
			}
			else {
				return 0
			}
		}
	}
	
	func panX() -> CGFloat {
		var panx = currentPanX + lastPanX
		if panx < 0 {
			panx = 0
		} else if panx > maxPanX() {
			panx = maxPanX()
		}
		return panx
	}
	
	override func pinchScale(_ scale:CGFloat, isEnd:Bool = false) {
		currentScale = scale
		if (isEnd) {
			lastScale = self.scale()
			currentScale = 1
		}
	}
	
	func scale() -> CGFloat {
		var scale = currentScale * lastScale
		if scale < MIN_SCALE {
			scale = MIN_SCALE
		} else if scale > MAX_SCALE {
			scale = MAX_SCALE
		}
		return scale
	}
	
// MARK: delegate
	func candleRenderData() -> [CandlePositionData] {
		return _candlePositionData
	}
	
	func xVerticalLines() -> [CGFloat] {
		return verticalLinesX
	}
	
	func timeVerticalLines() -> [Date] {
		return verticalLinesTime
	}
	
	func oneCandleWidth() -> CGFloat {
		return scale() * candleWidth
	}
	
	func oneSpacer() -> CGFloat {
		return scale() * spacer
	}
    
    func unitTest() {
        // the latest data is the first one in _candleData
        var sum = 0.0
        if _candleData.count > 20 {
            for i in 0..<20 {
                let data = _candleData[i]
                let percent = (data.high - data.low) / data.open
                sum += percent
            }
        }
        print("avg: \(sum/20)")
    }
}
